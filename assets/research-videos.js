/* Populate only videos whose real YouTube IDs have been recorded after upload. */
(async function () {
  const source = document.currentScript.src;
  let data;
  try {
    const response = await fetch(new URL('research-videos.json', source));
    if (!response.ok) return;
    data = await response.json();
  } catch (_) { return; }
  const route = location.pathname.replace(/\/+$/, '').split('/').pop();
  const video = (data.projects || {})[route];
  const valid = v => v && /^[A-Za-z0-9_-]{11}$/.test(v.id);
  if (valid(video)) {
    const anchor = document.querySelector('.hero-section, .sead-hero, .article-header, main .hero');
    if (!anchor || document.getElementById('research-video')) return;
    const section = document.createElement('section');
    section.id = 'research-video';
    section.style.cssText = 'width:min(960px,calc(100% - 40px));margin:36px auto 48px;box-sizing:border-box';
    const heading = document.createElement('h2');
    heading.textContent = 'Watch the research overview';
    heading.style.cssText = 'font-family:inherit;font-size:1.5rem;margin:0 0 18px;color:inherit';
    const frame = document.createElement('iframe');
    frame.src = 'https://www.youtube-nocookie.com/embed/' + video.id;
    frame.title = video.title;
    frame.loading = 'lazy';
    frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.style.cssText = 'display:block;width:100%;aspect-ratio:16/9;min-height:200px;border:0;border-radius:10px;background:#073642';
    const link = document.createElement('a');
    link.href = 'https://www.youtube.com/watch?v=' + video.id;
    link.textContent = 'Watch on YouTube ↗';
    link.style.cssText = 'display:inline-block;margin-top:12px;font-size:13px;color:inherit';
    section.append(heading, frame, link);
    anchor.insertAdjacentElement('afterend', section);
  }
  for (const card of document.querySelectorAll('.work')) {
    const label = card.querySelector('h3')?.textContent.trim();
    const entry = (data.featured || {})[label];
    const links = card.querySelector('.work-links');
    if (!valid(entry) || !links || links.querySelector('[data-video-link]')) continue;
    const link = document.createElement('a');
    link.href = 'https://www.youtube.com/watch?v=' + entry.id;
    link.textContent = 'Video ↗';
    link.dataset.videoLink = '';
    links.append(link);
  }
})();
