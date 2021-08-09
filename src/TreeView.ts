export interface ITreeViewNode {
    id: string;
    label: string;
    state: 'collapsed' | 'expanded' | undefined; // undefined means a leaf node
}

export interface ITreeViewProvider {
    getChildren(id?: string): Promise<ITreeViewNode[]>;
}

export interface ITreeViewOptions {
    provider: ITreeViewProvider;
}

export interface IMetadata {
    id: string;
    label: string;
    level: number;
    state: 'collapsed' | 'expanded' | 'loading' | undefined; // undefined means a leaf node
}

export abstract class TreeView {
    protected provider: ITreeViewProvider;
    protected root: HTMLElement | null;

    constructor(protected container: HTMLElement, options: ITreeViewOptions) {
        this.provider = options.provider;
        this.root = null;
        this._handleClick = this._handleClick.bind(this);
        this.attach();
    }

    protected attach() {
        if (this.root) {
            return;
        }
        this.root = document.createElement('div');
        this.root.classList.add('treeview');
        this.root.addEventListener('click', this._handleClick);
        this.container.appendChild(this.root);
        this._render(undefined, null, 0);
    }

    protected detach() {
        if (!this.root) {
            return;
        }
        this.root.removeEventListener('click', this._handleClick);
        this.container.removeChild(this.root);
        this.root = null;
    }

    protected abstract render(id: string, label: string, state: 'collapsed' | 'expanded' | 'loading' | undefined): HTMLElement;

    protected abstract onClick(el: HTMLElement, id: string, label: string, level: number): void;

    private async _render(id: string | undefined, insertAfterEl: HTMLElement | null, level: number): Promise<void> {
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
            } else {
                this.root.appendChild(el);
            }
            insertAfterEl = el;
            if (state === 'expanded') {
                await this._render(id, insertAfterEl, level + 1); // should this perhaps be async?
            }
        }
    }

    private _handleClick(ev: MouseEvent): boolean {
        if (!this.root) {
            return false;
        }
        let el = ev.target as HTMLElement;
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
                while (el.nextSibling && this._getMetadata(el.nextSibling as HTMLElement).level > level) {
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

    private _setState(el: HTMLElement, state: 'collapsed' | 'expanded' | 'loading'): HTMLElement {
        const { id, label, level } = this._getMetadata(el);
        const tmpEl = this.render(id, label, state);
        tmpEl.classList.add('treeview-node');
        tmpEl.style.paddingLeft = `${level}em`;
        this._setMetadata(tmpEl, { id, label, level, state });
        el.replaceWith(tmpEl);
        return tmpEl;
    }

    private _getMetadata(el: HTMLElement): IMetadata {
        return {
            id: el.getAttribute('data-treeview-id') as string,
            label: el.getAttribute('data-treeview-label') as string,
            level: parseInt(el.getAttribute('data-treeview-level') as string),
            state: el.getAttribute('data-treeview-state') as ('collapsed' | 'expanded' | 'loading' | undefined)
        };
    }

    private _setMetadata(el: HTMLElement, metadata: IMetadata): void {
        el.setAttribute('data-treeview-id', metadata.id);
        el.setAttribute('data-treeview-label', metadata.label);
        el.setAttribute('data-treeview-level', metadata.level.toString());
        if (metadata.state) {
            el.setAttribute('data-treeview-state', metadata.state);
        } else {
            el.removeAttribute('data-treeview-state');
        }
    }
}
