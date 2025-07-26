const plugins = ['DLive'];

async function loadPlugins() {
    const section = document.querySelector('.plugin-list');
    section.innerHTML = '';
    
    for (const plugin of plugins) {
        try {
            const resp = await fetch(`${plugin}/${plugin}Config.json`);
            if (!resp.ok) throw new Error("Configuration not found");
            
            const data = await resp.json();
            const {
                name = 'Unnamed Plugin',
                description = 'No description available',
                iconUrl = `${plugin}Icon.png`,
                version = 'N/A',
                author = 'Unknown',
                authorUrl = '#',
                repositoryUrl = '#',
                platformUrl = '#',
                changelog = {}
            } = data;

            // Create DOM elements instead of innerHTML
            const card = document.createElement('div');
            card.className = 'card';
            
            // Card Header
            const header = document.createElement('div');
            header.className = 'card-header';
            
            const icon = document.createElement('img');
            icon.src = `${plugin}/${iconUrl}`;
            icon.alt = `${name} icon`;
            icon.className = 'plugin-icon';
            
            const info = document.createElement('div');
            info.className = 'plugin-info';
            
            const nameLink = document.createElement('p');
            // nameLink.href = platformUrl;
            nameLink.textContent = name;
            nameLink.className = 'plugin-name';
            
            const desc = document.createElement('div');
            desc.textContent = description;
            desc.className = 'plugin-description';
            
            info.append(nameLink, desc);
            header.append(icon, info);
            
            // Card Content
            const content = document.createElement('div');
            content.className = 'card-content';
            
            const meta = document.createElement('div');
            meta.className = 'plugin-meta';
            
            const versionSpan = document.createElement('span');
            versionSpan.textContent = `Version: ${version}`;
            versionSpan.className = 'plugin-version';
            
            const authorLink = document.createElement('a');
            authorLink.href = authorUrl;
            authorLink.textContent = author;
            authorLink.className = 'plugin-creator';
            
            meta.append(versionSpan, ' | ', authorLink);
            
            // Changelog
            const details = document.createElement('details');
            const summary = document.createElement('summary');
            summary.textContent = 'Changelog';
            
            const changelogContent = document.createElement('div');
            changelogContent.className = 'changelog-content';
            
            Object.entries(changelog)
                .sort((a, b) => b[0].localeCompare(a[0]))
                .forEach(([ver, changes]) => {
                    const versionDiv = document.createElement('div');
                    versionDiv.className = 'version';
                    
                    const verTitle = document.createElement('p');
                    verTitle.textContent = `Version ${ver}`;
                    verTitle.className = 'version-title';
                    
                    const ul = document.createElement('ul');
                    ul.className = 'changes-list';
                    
                    changes.forEach(change => {
                        const li = document.createElement('li');
                        li.textContent = change;
                        li.className = 'change-item';
                        ul.appendChild(li);
                    });
                    
                    versionDiv.append(verTitle, ul);
                    changelogContent.appendChild(versionDiv);
                });
            
            details.append(summary, changelogContent);
            content.append(meta, details);
            
            // Card Footer
            const footer = document.createElement('div');
            footer.className = 'card-footer';
            
            const grayjayBtn = document.createElement('a');
            grayjayBtn.href = `grayjay://plugin/${window.location.href + `${plugin}/${plugin}Config.json`}`;
            grayjayBtn.className = 'button primary';
            grayjayBtn.innerHTML = '<span class="text">Open in Grayjay</span>';
            
            const sourceBtn = document.createElement('a');
            sourceBtn.href = repositoryUrl;
            sourceBtn.className = 'button';
            sourceBtn.innerHTML = '<span class="text">Source Code</span>';
            
            footer.append(grayjayBtn, sourceBtn);
            
            // Assemble card
            card.append(header, content, footer);
            section.appendChild(card);
            
        } catch (e) {
            console.error(`Error loading ${plugin}:`, e);
            const error = document.createElement('p');
            error.textContent = `Error loading ${plugin}: ${e.message}`;
            section.appendChild(error);
        }
    }
}

document.addEventListener('DOMContentLoaded', loadPlugins);