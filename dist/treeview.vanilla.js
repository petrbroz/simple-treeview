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

const NodeClass = 'treeview-node';
const CollapsedNodeClass = 'treeview-node-collapsed';
const ExpandedNodeClass = 'treeview-node-expanded';
const LeafNodeClass = 'treeview-node-leaf';
const LoadingNodeClass = 'treeview-node-loading';
class VanillaTreeView extends TreeView {
    renderNode(node) {
        const el = document.createElement('div');
        el.classList.add(NodeClass);
        switch (node.state) {
            case CollapsibleState.Collapsed:
                el.classList.add(CollapsedNodeClass);
                break;
            case CollapsibleState.Expanded:
                el.classList.add(ExpandedNodeClass);
                break;
            case CollapsibleState.None:
                el.classList.add(LeafNodeClass);
                break;
        }
        const icon = document.createElement('div');
        icon.classList.add('far');
        if (node.icon) {
            icon.classList.add(node.icon);
        }
        el.appendChild(icon);
        const label = document.createElement('label');
        label.innerText = node.label;
        el.appendChild(label);
        return el;
    }
    onNodeClicked(node, el) {
        alert(`Clicked on ${node.label} (id: ${node.id})`);
    }
    onNodeLoading(node, el) {
        el.classList.remove(ExpandedNodeClass, CollapsedNodeClass);
        el.classList.add(LoadingNodeClass);
    }
    onNodeCollapsed(node, el) {
        el.classList.remove(ExpandedNodeClass, LoadingNodeClass);
        el.classList.add(CollapsedNodeClass);
    }
    onNodeExpanded(node, el) {
        el.classList.remove(CollapsedNodeClass, LoadingNodeClass);
        el.classList.add(ExpandedNodeClass);
    }
}

export { VanillaTreeView };
