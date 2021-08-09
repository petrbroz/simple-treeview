class TreeView {
    constructor(container, options) {
        this.container = container;
        this.provider = options.provider;
        this.root = null;
        this._handleClick = this._handleClick.bind(this);
        this.attach();
    }
    attach() {
        if (this.root) {
            return;
        }
        this.root = document.createElement('div');
        this.root.classList.add('treeview');
        this.root.addEventListener('click', this._handleClick);
        this.container.appendChild(this.root);
        this._render(undefined, null, 0);
    }
    detach() {
        if (!this.root) {
            return;
        }
        this.root.removeEventListener('click', this._handleClick);
        this.container.removeChild(this.root);
        this.root = null;
    }
    async _render(id, insertAfterEl, level) {
        if (!this.root) {
            return;
        }
        const nodes = await this.provider.getChildren(id);
        for (const { id, label, state } of nodes) {
            const el = this.render(id, label, state);
            el.classList.add('treeview-node');
            this._setMetadata(el, { id, label, level, state });
            el.style.paddingLeft = `${level}em`;
            if (insertAfterEl) {
                insertAfterEl.insertAdjacentElement('afterend', el);
            }
            else {
                this.root.appendChild(el);
            }
            insertAfterEl = el;
            if (state === 'expanded') {
                await this._render(id, insertAfterEl, level + 1); // should this perhaps be async?
            }
        }
    }
    _handleClick(ev) {
        if (!this.root) {
            return false;
        }
        let el = ev.target;
        while (!el.hasAttribute('data-treeview-id') && el.parentElement) {
            el = el.parentElement;
        }
        console.assert(el.hasAttribute('data-treeview-id'));
        const { id, label, level, state } = this._getMetadata(el);
        switch (state) {
            case 'collapsed':
                el = this._setState(el, 'loading');
                this._render(id, el, level + 1)
                    .then(() => el = this._setState(el, 'expanded'));
                break;
            case 'expanded':
                while (el.nextSibling && this._getMetadata(el.nextSibling).level > level) {
                    this.root.removeChild(el.nextSibling);
                }
                el = this._setState(el, 'collapsed');
                break;
            default:
                this.onClick(el, id, label, level);
                break;
        }
        return false;
    }
    _setState(el, state) {
        const { id, label, level } = this._getMetadata(el);
        const tmpEl = this.render(id, label, state);
        tmpEl.classList.add('treeview-node');
        tmpEl.style.paddingLeft = `${level}em`;
        this._setMetadata(tmpEl, { id, label, level, state });
        el.replaceWith(tmpEl);
        return tmpEl;
    }
    _getMetadata(el) {
        return {
            id: el.getAttribute('data-treeview-id'),
            label: el.getAttribute('data-treeview-label'),
            level: parseInt(el.getAttribute('data-treeview-level')),
            state: el.getAttribute('data-treeview-state')
        };
    }
    _setMetadata(el, metadata) {
        el.setAttribute('data-treeview-id', metadata.id);
        el.setAttribute('data-treeview-label', metadata.label);
        el.setAttribute('data-treeview-level', metadata.level.toString());
        if (metadata.state) {
            el.setAttribute('data-treeview-state', metadata.state);
        }
        else {
            el.removeAttribute('data-treeview-state');
        }
    }
}

class VanillaTreeView extends TreeView {
    render(id, label, state) {
        const el = document.createElement('div');
        switch (state) {
            case 'collapsed':
                el.classList.add('treeview-node-collapsed');
                break;
            case 'expanded':
                el.classList.add('treeview-node-expanded');
                break;
            case 'loading':
                el.classList.add('treeview-node-loading');
                break;
            default:
                el.classList.add('treeview-node-leaf');
                break;
        }
        el.innerText = label;
        return el;
    }
    onClick(el, id, label, level) {
        alert(`Clicked on ${label} (id: ${id})`);
    }
}

export { VanillaTreeView };
