(() => {
    const menuBtn = document.querySelector('.mobile-bar__menu');
    const sheet = document.getElementById('mobileSheet');
    const backdrop = document.getElementById('mobileBackdrop');

    if (!menuBtn || !sheet || !backdrop) {
        return;
    }

    const closeBtn = sheet.querySelector('.mobile-sheet__close');
    const getFocusable = () => sheet.querySelectorAll('a[href], button:not([disabled])');
    const isOpen = () => sheet.classList.contains('is-open');

    let lastFocus = null;

    const open = () => {
        lastFocus = document.activeElement;
        sheet.classList.add('is-open');
        backdrop.classList.add('is-open');
        menuBtn.setAttribute('aria-expanded', 'true');
        document.body.classList.add('sheet-open');

        const first = getFocusable()[0];
        if (first) {
            first.focus();
        }
    };

    const close = () => {
        sheet.classList.remove('is-open');
        backdrop.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('sheet-open');

        if (lastFocus && typeof lastFocus.focus === 'function') {
            lastFocus.focus();
        }
    };

    menuBtn.addEventListener('click', () => {
        if (isOpen()) {
            close();
        } else {
            open();
        }
    });

    backdrop.addEventListener('click', close);

    if (closeBtn) {
        closeBtn.addEventListener('click', close);
    }

    sheet.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', close);
    });

    document.addEventListener('keydown', (event) => {
        if (!isOpen()) {
            return;
        }

        if (event.key === 'Escape') {
            close();
            return;
        }

        if (event.key !== 'Tab') {
            return;
        }

        const items = getFocusable();
        if (!items.length) {
            return;
        }

        const first = items[0];
        const last = items[items.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && isOpen()) {
            close();
        }
    });
})();