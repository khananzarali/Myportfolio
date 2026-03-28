// GitHub Repository Fetcher
const username = "khananzarali";
const container = document.getElementById("projectsContainer");

fetch(`https://api.github.com/users/${username}/repos`)
  .then(res => res.json())
  .then(data => {
    // Filter and sort repositories
    const repos = data
      .filter(repo => !repo.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6);

    // Create project cards
    repos.forEach(repo => {
      const card = document.createElement("div");
      card.classList.add("project-card");

      // Create tech tags from repository topics or language
      const techTags = [];
      if (repo.language) {
        techTags.push(repo.language);
      }
      if (repo.topics && repo.topics.length > 0) {
        repo.topics.slice(0, 3).forEach(topic => {
          techTags.push(topic);
        });
      }

      // Build card HTML
      card.innerHTML = `
        <h3>${repo.name}</h3>
        <p>${repo.description || "A project showcasing my development skills and problem-solving abilities."}</p>
        <div class="project-meta">
          ${techTags.map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
        </div>
        <div class="project-links">
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">View Code</a>
          ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" rel="noopener noreferrer">Live Demo</a>` : ''}
        </div>
      `;

      container.appendChild(card);
    });

    // If no repos found, show a message
    if (repos.length === 0) {
      container.innerHTML = `
        <div class="project-card">
          <h3>Projects Coming Soon</h3>
          <p>I'm currently working on some exciting projects. Check back soon to see my latest work!</p>
          <div class="project-links">
            <a href="https://github.com/${username}" target="_blank" rel="noopener noreferrer">View GitHub Profile</a>
          </div>
        </div>
      `;
    }
  })
  .catch(error => {
    console.error('Error fetching repositories:', error);
    container.innerHTML = `
      <div class="project-card">
        <h3>Unable to Load Projects</h3>
        <p>There was an error loading projects from GitHub. Please visit my GitHub profile directly.</p>
        <div class="project-links">
          <a href="https://github.com/${username}" target="_blank" rel="noopener noreferrer">View GitHub Profile</a>
        </div>
      </div>
    `;
  });
