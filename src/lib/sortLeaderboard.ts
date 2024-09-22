interface IntraScore {
  id: string;
  pointsId: string;
  score: number;
  type: string;
  createdAt: string;
  updatedAt: string;
}

interface LeaderboardEntry {
  id: string;
  userId: string;
  stages: string[];
  score: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  user: {
    image: any;
    id: string;
    name: string;
    email: string;
    // ... other user properties
  };
  intraScores: IntraScore[];
}

export function sortLeaderboard(data: LeaderboardEntry[]): {
  sortedByOverallScore: LeaderboardEntry[];
  sortedByIntraScores: LeaderboardEntry[];
  groupedAndSortedIntraScores: { [key: string]: Array<IntraScore & { userName: string; userImage: string }> };
} {
  // Sort by overall score
  const sortedByOverallScore = [...data].sort((a, b) => b.score - a.score);

  // Sort intraScores for each entry
  const sortedByIntraScores = sortedByOverallScore.map(entry => ({
    ...entry,
    intraScores: [...entry.intraScores].sort((a, b) => {
      if (a.type !== b.type) {
        return a.type.localeCompare(b.type);
      }
      return b.score - a.score;
    })
  }));

  // Extract all intraScores into a single array, adding user name and image
  const allIntraScores = data.flatMap(item => 
    item.intraScores.map(score => ({
      ...score,
      userName: item.user.name,
      userImage: item.user.image
    }))
  );

  // Group by type
  const groupedByType = allIntraScores.reduce((acc, score) => {
    if (!acc[score.type]) {
      acc[score.type] = [];
    }
    acc[score.type].push(score);
    return acc;
  }, {} as { [key: string]: Array<IntraScore & { userName: string; userImage: string }> });

  // Sort each group by score in descending order
  const groupedAndSortedIntraScores = Object.keys(groupedByType).reduce((acc, type) => {
    acc[type] = groupedByType[type].sort((a, b) => b.score - a.score);
    return acc;
  }, {} as { [key: string]: Array<IntraScore & { userName: string; userImage: string }> });

  return { sortedByOverallScore, sortedByIntraScores, groupedAndSortedIntraScores };
}
