export interface DeploymentsResponse {
  deployments: Deployment[];
  pagination: Pagination;
}

interface Pagination {
  count: number;
  next: string;
  prev: string;
}

export interface Deployment {
  uid: string;
  name: string;
  url: string;
  created: number;
  source: string;
  state: string;
  readyState: string;
  readySubstate: string;
  type: string;
  creator: Creator;
  inspectorUrl: string;
  meta: Meta;
  target: string;
  aliasError: null;
  aliasAssigned: number;
  isRollbackCandidate: boolean;
  createdAt: number;
  buildingAt: number;
  ready: number;
  projectSettings: ProjectSettings;
}

export interface Creator {
  uid: string;
  email: string;
  username: string;
  githubLogin: string;
}

export interface Meta {
  githubCommitAuthorName: string;
  githubCommitMessage: string;
  githubCommitOrg: string;
  githubCommitRef: string;
  githubCommitRepo: string;
  githubCommitSha: string;
  githubDeployment: string;
  githubOrg: string;
  githubRepo: string;
  githubRepoOwnerType: string;
  githubCommitRepoId: string;
  githubRepoId: string;
  githubRepoVisibility: string;
  githubCommitAuthorLogin: string;
  branchAlias: string;
}

export interface ProjectSettings {
  commandForIgnoringBuildStep: null;
}
