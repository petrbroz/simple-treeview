export enum CollapsibleState {
    None = '',
    Collapsed = 'collapsed',
    Expanded = 'expanded'
}

export interface IItem {
    id: string;
    icon?: string;
    label: string;
    state?: CollapsibleState;
}

export interface IDataProvider {
    getChildren(id?: string): Promise<IItem[]>;
}

export interface ITreeViewOptions {
    provider: IDataProvider;
}

export interface INode extends IItem {
    state: CollapsibleState;
    level: number;
    loading: boolean;
}

export abstract class TreeView {
    protected provider: IDataProvider;
    protected root: HTMLElement;

    constructor(protected container: HTMLElement, options: ITreeViewOptions) {
        this.provider = options.provider;
        this.root = document.createElement('div');
        this.root.classList.add('treeview');
        this._onRootClick = this._onRootClick.bind(this);
        this.attach();
    }

    protected attach() {
        this.root.addEventListener('click', this._onRootClick);
        this.container.appendChild(this.root);
        this._render(undefined, 0);
    }

    protected detach() {
        this.root.removeEventListener('click', this._onRootClick);
        this.container.removeChild(this.root);
    }

    protected abstract renderNode(node: INode): HTMLElement;
    protected abstract onNodeClicked(node: INode, el: HTMLElement): void;
    protected abstract onNodeLoading(node: INode, el: HTMLElement): void;
    protected abstract onNodeCollapsed(node: INode, el: HTMLElement): void;
    protected abstract onNodeExpanded(node: INode, el: HTMLElement): void;

    private _onRootClick(ev: MouseEvent): boolean {
        let el = ev.target as HTMLElement;
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

    private async _render(id: string | undefined, level: number, insertAfterEl?: HTMLElement): Promise<void> {
        const root = this.root as HTMLElement;
        const children = await this.provider.getChildren(id);
        for (const { id, label, icon, state } of children) {
            const metadata: INode = { id, label, level, icon, state: state || CollapsibleState.None, loading: false };
            const el = this.renderNode(metadata);
            el.style.paddingLeft = `${level}em`;
            this._setMetadata(el, metadata);
            if (insertAfterEl) {
                insertAfterEl.insertAdjacentElement('afterend', el);
            } else {
                root.appendChild(el);
            }
            insertAfterEl = el;
            if (metadata.state === CollapsibleState.Expanded) {
                this._expandNode(el);
            }
        }
    }

    private _expandNode(el: HTMLElement) {
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

    private _collapseNode(el: HTMLElement) {
        const root = this.root as HTMLElement;
        const metadata = this._getMetadata(el);
        if (!metadata.loading) {
            while (el.nextSibling && this._getMetadata(el.nextSibling as HTMLElement).level > metadata.level) {
                root.removeChild(el.nextSibling);
            }
            metadata.state = CollapsibleState.Collapsed;
            this._setMetadata(el, metadata);
            this.onNodeCollapsed(metadata, el);
        }
    }

    private _getMetadata(el: HTMLElement): INode {
        console.assert(el.hasAttribute('data-treeview'));
        return JSON.parse(el.getAttribute('data-treeview') as string) as INode;
    }

    private _setMetadata(el: HTMLElement, metadata: INode): void {
        el.setAttribute('data-treeview', JSON.stringify(metadata));
    }

    private _hasMetadata(el: HTMLElement): boolean {
        return el.hasAttribute('data-treeview');
    }
}
