/**
 * Tree node state.
 */
export enum CollapsibleState {
    /** Node cannot be neither collapsed nor expanded. It is a leaf. */
    None = '',
    /** Node is collapsed and can be expanded. */
    Collapsed = 'collapsed',
    /** Node is expanded and can be collapsed. */
    Expanded = 'expanded'
}

/**
 * User-defined tree node data.
 */
export interface IItem {
    /** Tree node ID. Must be unique within a single tree view. */
    id: string;
    /**
     * Optional CSS class to be used as an icon. The value can have multiple forms:
     * - an object with `src` property
     *   - in this case the tree will include an image with the given source URL
     * - an object with `classes` property
     *   - in this case the tree will add an `<i>` element with all these CSS classes
     * - a string
     *   - in this case the tree will add an `<i>` element with this string as a CSS class
     */
    icon?: string | { src: string } | { classes: string[] };
    /** Tree node label. */
    label: string;
    /** Tree node state. Nodes with state `CollapsibleState.None` or `undefined` are considered to have no children. */
    state?: CollapsibleState;
}

/**
 * Data provider for a tree view.
 */
export interface IDataProvider {
    /**
     * Retrieves data for all children of a specific tree node.
     * @async
     * @param [id] Optional tree node ID. If undefined, the method should return all root nodes.
     * @returns {Promise<IItem[]>}
     */
    getChildren(id?: string): Promise<IItem[]>;
}

/**
 * Tree view options.
 */
export interface ITreeViewOptions {
    /** Data provider. */
    provider: IDataProvider;
    /** Selection change handler. */
    onSelectionChanged?: (nodes: INode[]) => void;
}

/**
 * Runtime metadata of a tree node.
 */
export interface INode extends IItem {
    /** Tree node state. Nodes with state `CollapsibleState.None` or undefined are considered to be leaves. */
    state: CollapsibleState;
    /** Depth in the tree hierarchy. */
    level: number;
    /** Whether the children of this node are currently being loaded. */
    loading: boolean;
}

/**
 * Core implementation of tree view component providing the basic functionality.
 * @abstract
 */
export abstract class TreeView {
    protected provider: IDataProvider;
    protected onSelectionChanged?: (nodes: INode[]) => void;
    protected root: HTMLElement;

    /**
     * Initializes a new tree view.
     * @param container HTML element that will host the tree view.
     * @param options Additional options.
     */
    constructor(protected container: HTMLElement, options: ITreeViewOptions) {
        this.provider = options.provider;
        this.onSelectionChanged = options.onSelectionChanged;
        this.root = document.createElement('div');
        this._onRootClick = this._onRootClick.bind(this);
        this.attach();
    }

    /**
     * Attaches the tree view to the DOM.
     */
    protected attach() {
        this.root.addEventListener('click', this._onRootClick);
        this.container.appendChild(this.root);
        this._render(undefined, 0);
    }

    /**
     * Detaches the tree view from the DOM.
     */
    protected detach() {
        this.root.removeEventListener('click', this._onRootClick);
        this.container.removeChild(this.root);
    }


    /**
     * Creates new HTML representation of a tree node.
     * @abstract
     * @param node Tree node metadata.
     * @returns New block-based HTML element.
     */
    protected abstract renderNode(node: INode): HTMLElement;

    /**
     * Reacts to the event of a tree node being clicked.
     * @param node Tree node metadata.
     * @param el Tree node HTML element.
     */
    protected abstract onNodeClicked(node: INode, el: HTMLElement): void;

    /**
     * Reacts to the event of a tree node loading its children.
     * @param node Tree node metadata.
     * @param el Tree node HTML element.
     */
    protected abstract onNodeLoading(node: INode, el: HTMLElement): void;

    /**
     * Reacts to the event of a tree node being collapsed.
     * @param node Tree node metadata.
     * @param el Tree node HTML element.
     */
    protected abstract onNodeCollapsed(node: INode, el: HTMLElement): void;

    /**
     * Reacts to the event of a tree node being expanded.
     * @param node Tree node metadata.
     * @param el Tree node HTML element.
     */
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
                if (this.onSelectionChanged) {
                    this.onSelectionChanged([metadata]);
                }
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
