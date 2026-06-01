(function () {
    const baseTag = document.createElement('base');

    baseTag.href = location.hostname.includes('github.io')
        ? '/ZitrusStudioWebSite/'
        : '/';

    document.head.prepend(baseTag);
})();