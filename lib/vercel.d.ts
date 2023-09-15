export interface DeploymentsResponse {
  deployments: Deployment[];
  pagination: Pagination;
}

export interface Pagination {
  count: number;
  next: null;
  prev: number;
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

export interface ProjectResponse {
  projects: Project[];
  pagination: Pagination;
}

export interface Project {
  accountId: string;
  autoExposeSystemEnvs: boolean;
  autoAssignCustomDomains: boolean;
  autoAssignCustomDomainsUpdatedBy: string;
  buildCommand: null;
  createdAt: number;
  crons: Crons;
  devCommand: null;
  directoryListing: boolean;
  framework: string;
  gitForkProtection: boolean;
  gitLFS: boolean;
  id: string;
  installCommand: null;
  lastRollbackTarget: null;
  lastAliasRequest: null;
  name: string;
  nodeVersion: string;
  outputDirectory: null;
  publicSource: null;
  rootDirectory: null;
  serverlessFunctionRegion: string;
  sourceFilesOutsideRootDirectory: boolean;
  updatedAt: number;
  live: boolean;
  gitComments: GitComments;
  link: Link;
  latestDeployments: LatestDeployment[];
  targets: Targets;
}

export interface Crons {
  enabledAt: number;
  disabledAt: null;
  updatedAt: number;
  deploymentId: string;
  definitions: any[];
}

export interface GitComments {
  onCommit: boolean;
  onPullRequest: boolean;
}

export interface LatestDeployment {
  alias: string[];
  aliasAssigned: number;
  aliasError: null;
  automaticAliases: string[];
  builds: any[];
  createdAt: number;
  createdIn: string;
  creator: Creator;
  deploymentHostname: string;
  forced: boolean;
  id: string;
  meta: Meta;
  name: string;
  plan: string;
  private: boolean;
  readyState: string;
  readySubstate: string;
  target: string;
  teamId: null;
  type: string;
  url: string;
  userId: string;
  withCache: boolean;
  buildingAt: number;
  readyAt: number;
  previewCommentsEnabled: boolean;
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

export interface Link {
  type: string;
  repo: string;
  repoId: number;
  org: string;
  gitCredentialId: string;
  productionBranch: string;
  sourceless: boolean;
  createdAt: number;
  updatedAt: number;
  deployHooks: any[];
}

export interface Targets {
  production: LatestDeployment;
}
