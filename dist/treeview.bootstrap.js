var CollapsibleState;
(function (CollapsibleState) {
    CollapsibleState["None"] = "";
    CollapsibleState["Collapsed"] = "collapsed";
    CollapsibleState["Expanded"] = "expanded";
})(CollapsibleState || (CollapsibleState = {}));
class TreeView {
    constructor(container, options) {
        this.container = container;
        this.provider = options.provider;
        this.root = document.createElement('div');
        this.root.classList.add('treeview');
        this._onRootClick = this._onRootClick.bind(this);
        this.attach();
    }
    attach() {
        this.root.addEventListener('click', this._onRootClick);
        this.container.appendChild(this.root);
        this._render(undefined, 0);
    }
    detach() {
        this.root.removeEventListener('click', this._onRootClick);
        this.container.removeChild(this.root);
    }
    _onRootClick(ev) {
        let el = ev.target;
        while (!this._hasMetadata(el) && el.parentElement) {
            el = el.parentElement;
        }
        const metadata = this._getMetadata(el);
        switch (metadata.state) {
            case CollapsibleState.Collapsed:
                this._expandNode(el);
                break;
            case CollapsibleState.Expanded:
                this._collapseNode(el);
                break;
            default:
                this.onNodeClicked(metadata, el);
                break;
        }
        return false;
    }
    async _render(id, level, insertAfterEl) {
        const root = this.root;
        const children = await this.provider.getChildren(id);
        for (const { id, label, icon, state } of children) {
            const metadata = { id, label, level, icon, state: state || CollapsibleState.None, loading: false };
            const el = this.renderNode(metadata);
            el.style.paddingLeft = `${level}em`;
            this._setMetadata(el, metadata);
            if (insertAfterEl) {
                insertAfterEl.insertAdjacentElement('afterend', el);
            }
            else {
                root.appendChild(el);
            }
            insertAfterEl = el;
            if (metadata.state === CollapsibleState.Expanded) {
                this._expandNode(el);
            }
        }
    }
    _expandNode(el) {
        const metadata = this._getMetadata(el);
        if (!metadata.loading) {
            metadata.loading = true;
            this._setMetadata(el, metadata);
            this.onNodeLoading(metadata, el);
            this._render(metadata.id, metadata.level + 1, el)
                .then(() => {
                metadata.loading = false;
                metadata.state = CollapsibleState.Expanded;
                this._setMetadata(el, metadata);
                this.onNodeExpanded(metadata, el);
            });
        }
    }
    _collapseNode(el) {
        const root = this.root;
        const metadata = this._getMetadata(el);
        if (!metadata.loading) {
            while (el.nextSibling && this._getMetadata(el.nextSibling).level > metadata.level) {
                root.removeChild(el.nextSibling);
            }
            metadata.state = CollapsibleState.Collapsed;
            this._setMetadata(el, metadata);
            this.onNodeCollapsed(metadata, el);
        }
    }
    _getMetadata(el) {
        console.assert(el.hasAttribute('data-treeview'));
        return JSON.parse(el.getAttribute('data-treeview'));
    }
    _setMetadata(el, metadata) {
        el.setAttribute('data-treeview', JSON.stringify(metadata));
    }
    _hasMetadata(el) {
        return el.hasAttribute('data-treeview');
    }
}

class BootstrapTreeView extends TreeView {
    renderNode(node) {
        const el = document.createElement('div');
        el.classList.add('treeview-node', 'list-group-item', 'list-group-item-action');
        const expando = document.createElement('i');
        expando.classList.add('bi', 'expando');
        el.appendChild(expando);
        const icon = document.createElement('i');
        icon.classList.add('bi');
        if (node.icon) {
            icon.classList.add(node.icon);
        }
        el.appendChild(icon);
        const span = document.createElement('span');
        span.innerText = node.label;
        el.appendChild(span);
        switch (node.state) {
            case CollapsibleState.Collapsed:
                expando.classList.add('bi-chevron-right');
                break;
            case CollapsibleState.Expanded:
                expando.classList.add('bi-chevron-down');
                break;
            case CollapsibleState.None:
                expando.classList.add('bi-dot');
                break;
        }
        return el;
    }
    onNodeClicked(node, el) {
        for (const activeEl of this.root.querySelectorAll('.active')) {
            activeEl.classList.remove('active');
        }
        el.classList.add('active');
    }
    onNodeLoading(node, el) {
        const expando = el.querySelector('.expando');
        expando.classList.remove('bi-chevron-right', 'bi-chevron-down');
        expando.classList.add('bi-hourglass');
    }
    onNodeCollapsed(node, el) {
        const expando = el.querySelector('.expando');
        expando.classList.remove('bi-chevron-down', 'bi-hourglass');
        expando.classList.add('bi-chevron-right');
    }
    onNodeExpanded(node, el) {
        const expando = el.querySelector('.expando');
        expando.classList.remove('bi-chevron-right', 'bi-hourglass');
        expando.classList.add('bi-chevron-down');
    }
}

export { BootstrapTreeView };
