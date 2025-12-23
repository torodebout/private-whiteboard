import debounce from 'lodash.debounce';
import { Tldraw, Editor, TLRecord } from 'tldraw';
import 'tldraw/tldraw.css';
import { useCallback, useEffect, useState } from 'react';

export default function Whiteboard() {
    const [snapshot, setSnapshot] = useState<unknown>(null);
    const [loading, setLoading] = useState(true);
    const [editor, setEditor] = useState<Editor | null>(null);

    useEffect(() => {
        fetch('/api/scene')
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    setSnapshot(data);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to load scene:', err);
                setLoading(false);
            });
    }, []);

    const saveToBackend = useCallback(async (currentEditor: Editor) => {
        const snapshot = currentEditor.store.serialize('all');
        try {
            await fetch('/api/scene', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(snapshot),
            });
        } catch (err) {
            console.error('Save failed:', err);
        }
    }, []);

    const handleMount = useCallback((editorInstance: Editor) => {
        setEditor(editorInstance);

        if (snapshot && typeof snapshot === 'object') {
            try {
                const records = Object.values(snapshot);
                editorInstance.store.put(records as TLRecord[]);
            } catch (error) {
                console.error('Failed to load snapshot into store:', error);
            }
        }

        const debouncedSave = debounce(() => {
            saveToBackend(editorInstance);
        }, 1000);

        editorInstance.store.listen(() => {
            debouncedSave();
        });
    }, [snapshot, saveToBackend]);

    if (loading) return <div className="flex items-center justify-center h-screen w-full">Loading...</div>;

    return (
        <div className="fixed inset-0 h-screen w-screen overflow-hidden">
            <Tldraw onMount={handleMount} />
            {editor && (
                <button
                    className="absolute bottom-0 right-0 m-2 bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-2 px-6 rounded shadow-lg z-[9999] transition-colors"
                    onClick={() => {
                        saveToBackend(editor);
                    }}
                >
                    Save Now
                </button>
            )}
        </div>
    );
}
