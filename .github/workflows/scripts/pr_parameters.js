module.exports = class PRManager {

    constructor(context, github ,core) {
      this.context = context;
      this.github = github;
      this.core = core;
    }

    async getMergedPullRequest() {
      const context = this.context
      , github = this.github
      , core = this.core
      ;
      const pull = await this.getMergedPullRequestInternal();

      core.setOutput('title', pull.title);
    }



    async getMergedPullRequestInternal() {
        const context = this.context
        , github = this.github
        , self = this;
        ;

        const resp = await github.pulls.list({
            owner: context.repo.owner,
            repo: context.repo.repo,
            sort: 'updated',
            direction: 'desc',
            state: 'closed',
            per_page: 100
          });
        
          const pull = resp.data.find(p => p.merge_commit_sha === sha);
          if (!pull) {
            return null;
          }
        
          return {
            title: pull.title,
            body: pull.body,
            number: pull.number,
            labels: pull.labels.map(l => l.name),
            assignees: pull.assignees.map(a => a.login)
          };
        }
    
}