/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useAtom } from 'jotai';
import { easing } from 'maath';
import { JSX, useMemo, useRef } from 'react';
import {
    Bone,
    BoxGeometry,
    Color,
    Float32BufferAttribute,
    Group,
    MeshStandardMaterial,
    Skeleton,
    SkinnedMesh,
    SRGBColorSpace,
    Uint16BufferAttribute,
    Vector3
} from 'three';
import { degToRad } from 'three/src/math/MathUtils.js';
import { pageAtom, pages } from './UI';
import { useThree } from "@react-three/fiber";


const easingFactor = 0.5
const insideCurveStrength = 0.18
const outsideCurveStrength = 0.05
const turningCurveStrength = 0.09

const PAGE_WIDTH = 1.79;
const PAGE_HEIGHT = 2.39;
const PAGE_DEPTH = 0.003
const PAGE_SEGMENTS = 30
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS;

const pageGeometry = new BoxGeometry(
    PAGE_WIDTH,
    PAGE_HEIGHT,
    PAGE_DEPTH,
    PAGE_SEGMENTS,
    2
)

pageGeometry.translate(PAGE_WIDTH / 2, 0, 0)
const position = pageGeometry.attributes.position;
const vertex = new Vector3()
const skinIndexes: number[] = []
const skinWeights: number[] = []

for (let i = 0; i < position.count; i++) {
    vertex.fromBufferAttribute(position, i)
    const x = vertex.x

    const skinIndex = Math.max(0, Math.floor(x / SEGMENT_WIDTH))
    const skinWeight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH

    skinIndexes.push(skinIndex, skinIndex + 1, 0, 0)
    skinWeights.push(1 - skinWeight, skinWeight, 0, 0)
}

pageGeometry.setAttribute(
    "skinIndex",
    new Uint16BufferAttribute(skinIndexes, 4)
)
pageGeometry.setAttribute(
    "skinWeight",
    new Float32BufferAttribute(skinWeights, 4)
)

const whiteColor = new Color("white")

const pageMaterials = [
    new MeshStandardMaterial({ color: whiteColor }),
    new MeshStandardMaterial({ color: "#111" }),
    new MeshStandardMaterial({ color: whiteColor }),
    new MeshStandardMaterial({ color: whiteColor }),
]

pages.forEach((page) => {
    useTexture.preload(`textures/${page.front}.jpg`)
    useTexture.preload(`textures/${page.back}.jpg`)
    useTexture.preload(`textures/book-cover-roughness.jpg`)
})

interface PageProps {
    number: number
    front: string
    back: string
    page: number
    opened: boolean
    bookClosed: boolean
}

const Page = ({ number, front, back, page, opened, bookClosed }: PageProps) => {
    const [picture, picture2, pictureRoughness] = useTexture([
        `textures/${front}.jpg`,
        `textures/${back}.jpg`,
        ...(number === 0 || number === pages.length - 1
            ? [`textures/book-cover-roughness.jpg`]
            : []),
    ])
    picture.colorSpace = picture2.colorSpace = SRGBColorSpace

    const group = useRef<Group>(null)
    const turnedAt = useRef<number>(0)
    const lastOpened = useRef<boolean>(opened)
    const skinnedMeshRef = useRef<SkinnedMesh>(null)

    const manualSkinnedMesh = useMemo(() => {
        const bones: Bone[] = []
        for (let i = 0; i <= PAGE_SEGMENTS; i++) {
            const bone = new Bone()
            bones.push(bone)
            if (i === 0) {
                bone.position.x = 0
            } else {
                bone.position.x = SEGMENT_WIDTH
            }
            if (i > 0) {
                bones[i - 1].add(bone)
            }
        }
        const skeleton = new Skeleton(bones)
        const materials = [
            ...pageMaterials,
            new MeshStandardMaterial({
                color: whiteColor,
                map: picture,
                ...(number === 0
                    ? { roughnessMap: pictureRoughness }
                    : { roughness: 0.1 }),
            }),
            new MeshStandardMaterial({
                color: whiteColor,
                map: picture2,
                ...(number === pages.length - 1
                    ? { roughnessMap: pictureRoughness }
                    : { roughness: 0.1 }),
            }),
        ]
        const mesh = new SkinnedMesh(pageGeometry, materials)
        mesh.castShadow = true
        mesh.receiveShadow = true
        mesh.frustumCulled = false
        mesh.add(skeleton.bones[0])
        mesh.bind(skeleton)
        return mesh
    }, [])

    useFrame((_, delta) => {
        if (!skinnedMeshRef.current || !group.current) return;

        if (lastOpened.current !== opened) {
            turnedAt.current = +new Date();
            lastOpened.current = opened;
        }

        let turningTime = Math.min(400, +new Date() - turnedAt.current) / 400;
        turningTime = Math.sin(turningTime * Math.PI);

        let targetRotation = opened ? -Math.PI / 2 : Math.PI / 2;
        if (!bookClosed) {
            targetRotation += degToRad(number * 0.8);
        }

        const bones = skinnedMeshRef.current.skeleton.bones;
        for (let i = 0; i < bones.length; i++) {
            const target = i === 0 ? group.current : bones[i];
            const insideCurveIntensity = i < 8 ? Math.sin(i * 0.2 + 0.25) : 0;
            const outsideCurveIntensity = i >= 8 ? Math.cos(i * 0.3 + 0.9) : 0;
            const turningCurveIntensity =
                Math.sin(i * Math.PI * (1 / bones.length)) * turningTime;

            let rotationAngle =
                insideCurveStrength * insideCurveIntensity * targetRotation -
                outsideCurveStrength * outsideCurveIntensity * targetRotation +
                turningCurveStrength * turningCurveIntensity * targetRotation;

            if (bookClosed) {
                rotationAngle = i === 0 ? targetRotation : 0;
            }

            easing.dampAngle(target.rotation, "y", rotationAngle, easingFactor, delta)
        }
    })

    return (
        <group ref={group}>
            <primitive
                object={manualSkinnedMesh}
                ref={skinnedMeshRef}
                position-z={-number * PAGE_DEPTH + page * PAGE_DEPTH}
            />
        </group>
    )
}

export default function Book(props: JSX.IntrinsicElements['group']) {
    const [page] = useAtom(pageAtom)
    const { viewport } = useThree()

    // viewport.width is responsive to screen size
    const scale = useMemo(() => {
        if (viewport.width < 5) return 0.45   // mobile
        if (viewport.width < 8) return 0.9   // tablet
        return 1.1                           // desktop
    }, [viewport.width])

    return (
        <group
            {...props}
            rotation-y={-Math.PI / 2}
            scale={[scale, scale, scale]}
        >
            {[...pages].map((pageData, index) =>
                <Page
                    key={index}
                    page={page}
                    opened={page > index}
                    bookClosed={page === 0 || page === pages.length}
                    number={index}
                    {...pageData}
                />
            )}
        </group>
    )
}