const content_dir = 'contents/';
const config_file = 'config.yml';
const section_names = ['abstract', 'method', 'results', 'analysis', 'citation'];

window.addEventListener('DOMContentLoaded', () => {

  fetch(content_dir + config_file)
    .then(r => r.text())
    .then(text => {
      const yml = jsyaml.load(text);
      Object.keys(yml).forEach(key => {
        const el = document.getElementById(key);
        if (!el) return;
        if (key.startsWith('link-')) {
          el.href = yml[key];
        } else {
          el.innerHTML = yml[key];
        }
      });
    })
    .catch(err => console.log('Config load error:', err));

  marked.use({ mangle: false, headerIds: false });

  section_names.forEach(name => {
    fetch(content_dir + name + '.md')
      .then(r => r.text())
      .then(md => {
        document.getElementById(name + '-md').innerHTML = marked.parse(md);
      })
      .then(() => {
        if (typeof MathJax !== 'undefined') MathJax.typeset();
      })
      .catch(err => console.log('Section load error (' + name + '):', err));
  });

  document.addEventListener('click', e => {
    if (!e.target.classList.contains('copy-btn')) return;
    const pre = e.target.closest('.citation-block').querySelector('pre');
    navigator.clipboard.writeText(pre.textContent);
    e.target.textContent = 'Copied!';
    setTimeout(() => { e.target.textContent = 'Copy'; }, 2000);
  });

});
