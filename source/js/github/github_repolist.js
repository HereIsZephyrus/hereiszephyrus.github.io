// Execute the curl command

const { description } = require('hexo/dist/hexo/default_config');

//var user_name = 'HereIsZephyrus'
function get_repolist_info(user_name){
    const { exec } = require('child_process');
    const api_url = `https://api.github.com/users/${user_name}/repos`

    exec(`curl ${api_url}`, (error, stdout, stderr) => {
    if (error) {
        console.error('failed to fetch repository list.');
        return;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }

    let is_HideRepo = (repository) => {
        return !(repository.private && hide_private)
    };
    return repolist = (hide_private = true) =>{
        return repolist = JSON.parse(stdout)
            .filter((repository) => is_HideRepo(repository))
            .map((repository) => {
                return {
                    id : repository.id,
                    name: repository.name,
                    url: repository.html_url,
                    description: repository.description,
                    license : repository.license,
                    forks_count : repository.forks_count,
                    archived: repository.archived,
                    is_forked : repository.fork,
                    watchers : repository.watchers,
                    forks : repository.forks,
                    topics : repository.topics,
                    language : repository.language
                }
            });
    }
    });
}

