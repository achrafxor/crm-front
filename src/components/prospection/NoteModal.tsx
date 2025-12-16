import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
} from '@mui/material';
import { useState, useEffect } from 'react';

interface NoteModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (note: string) => void;
    title: string;
    initialNote?: string;
}

const NoteModal: React.FC<NoteModalProps> = ({
    open,
    onClose,
    onSave,
    title,
    initialNote = '',
}) => {
    const [note, setNote] = useState(initialNote);

    useEffect(() => {
        if (open) {
            setNote(initialNote);
        }
    }, [open, initialNote]);

    const handleSave = () => {
        onSave(note);
        onClose();
        setNote('');
    };

    const handleClose = () => {
        onClose();
        setNote('');
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        multiline
                        rows={6}
                        label="Note"
                        placeholder="Ajoutez une note sur ce vendeur..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        variant="outlined"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Annuler</Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                    Sauvegarder
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NoteModal;


