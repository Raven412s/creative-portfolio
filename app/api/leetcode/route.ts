import { NextResponse } from "next/server"

const LEETCODE_GQL = "https://leetcode.com/graphql"

const query = `
  query getUserProfile($username: String!) {
    allQuestionsCount {
      difficulty
      count
    }
    matchedUser(username: $username) {
      username
      profile {
        ranking
      }
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
      }
      userCalendar {
        totalActiveDays
        streak
        submissionCalendar
      }
    }
  }
`

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get("username") ?? "Ashutosh_Sharan"

  try {
    const res = await fetch(LEETCODE_GQL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Referer: "https://leetcode.com" },
      body: JSON.stringify({ query, variables: { username } }),
      next: { revalidate: 3600 }, // cache for 1 hour
    })

    if (!res.ok) throw new Error(`LeetCode API error: ${res.status}`)

    const { data } = await res.json()
    const user = data.matchedUser

    // Total questions per difficulty
    const totals: Record<string, number> = {}
    for (const q of data.allQuestionsCount) totals[q.difficulty] = q.count

    // Solved per difficulty
    const solved: Record<string, number> = {}
    for (const s of user.submitStatsGlobal.acSubmissionNum) solved[s.difficulty] = s.count

    // Submission calendar → count submissions in last 365 days
    const calendar: Record<string, number> = JSON.parse(user.userCalendar.submissionCalendar)
    const oneYearAgo = Math.floor(Date.now() / 1000) - 365 * 24 * 60 * 60
    const submissionsLastYear = Object.entries(calendar)
      .filter(([ts]) => Number(ts) >= oneYearAgo)
      .reduce((acc, [, cnt]) => acc + cnt, 0)

    return NextResponse.json({
      username: user.username,
      ranking: user.profile.ranking,
      solved: {
        all: solved["All"] ?? 0,
        easy: solved["Easy"] ?? 0,
        medium: solved["Medium"] ?? 0,
        hard: solved["Hard"] ?? 0,
      },
      total: {
        all: totals["All"] ?? 0,
        easy: totals["Easy"] ?? 0,
        medium: totals["Medium"] ?? 0,
        hard: totals["Hard"] ?? 0,
      },
      calendar,
      submissionsLastYear,
      totalActiveDays: user.userCalendar.totalActiveDays,
      streak: user.userCalendar.streak,
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}