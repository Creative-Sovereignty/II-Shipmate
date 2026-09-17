export interface DiffLine {
  type: "added" | "removed" | "unchanged" | "empty";
  content: string;
  lineNumber?: number;
}

export interface SideBySideDiff {
  left: DiffLine[];
  right: DiffLine[];
}

/**
 * Computes a line-by-line side-by-side diff between two code strings.
 * Uses a classic Longest Common Subsequence (LCS) dynamic programming algorithm.
 */
export function computeSideBySideDiff(oldText: string, newText: string): SideBySideDiff {
  const a = oldText.split("\n");
  const b = newText.split("\n");
  const N = a.length;
  const M = b.length;

  // Initialize DP table
  const dp: number[][] = Array.from({ length: N + 1 }, () => new Int32Array(M + 1) as any);

  // Fill the DP matrix
  for (let i = 1; i <= N; i++) {
    for (let j = 1; j <= M; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const left: DiffLine[] = [];
  const right: DiffLine[] = [];

  let i = N;
  let j = M;

  // Backtrack to assemble aligned lines
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      // Unchanged line
      left.push({ type: "unchanged", content: a[i - 1], lineNumber: i });
      right.push({ type: "unchanged", content: b[j - 1], lineNumber: j });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      // Line added
      left.push({ type: "empty", content: "" });
      right.push({ type: "added", content: b[j - 1], lineNumber: j });
      j--;
    } else {
      // Line removed
      left.push({ type: "removed", content: a[i - 1], lineNumber: i });
      right.push({ type: "empty", content: "" });
      i--;
    }
  }

  // Reverse arrays to get top-to-bottom sequence
  return {
    left: left.reverse(),
    right: right.reverse(),
  };
}
