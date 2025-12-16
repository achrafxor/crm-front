import { useState } from 'react';
import { Typography, Box, Button, Paper, InputBase, Avatar } from '@mui/material';
import { Add, Search } from '@mui/icons-material';
import { useContacts } from '../context/ContactsContext';
import ContactsList from '../components/contacts/ContactsList';
import ContactForm from '../components/contacts/ContactForm';
import type { Contact } from '../types';

const Contacts = () => {
    const { contacts, addContact, updateContact, deleteContact } = useContacts();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState('');

    const handleOpenCreate = () => {
        setEditingContact(undefined);
        setIsFormOpen(true);
    };

    const handleEdit = (contact: Contact) => {
        setEditingContact(contact);
        setIsFormOpen(true);
    };

    const handleClose = () => {
        setIsFormOpen(false);
        setEditingContact(undefined);
    };

    const handleSubmit = (data: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => {
        if (editingContact) {
            updateContact(editingContact.id, data);
        } else {
            addContact(data);
        }
    };

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        color: '#1e293b',
                        mb: 0.5,
                    }}
                >
                    Contacts
                </Typography>
                <Typography
                    sx={{
                        color: '#64748b',
                        fontSize: '0.9375rem',
                    }}
                >
                    Gérez tous vos contacts et clients
                </Typography>
            </Box>

            <Paper
                sx={{
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            bgcolor: '#f8fafc',
                            borderRadius: 2,
                            px: 2,
                            py: 1,
                            flex: 1,
                            maxWidth: 400,
                            border: '1px solid #e2e8f0',
                        }}
                    >
                        <Search sx={{ color: '#94a3b8', mr: 1 }} />
                        <InputBase
                            placeholder="Rechercher un contact..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{
                                flex: 1,
                                fontSize: '0.875rem',
                            }}
                        />
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleOpenCreate}
                        sx={{
                            bgcolor: '#3b82f6',
                            borderRadius: 2,
                            px: 3,
                            py: 1.25,
                            fontWeight: 600,
                            textTransform: 'none',
                            boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)',
                            '&:hover': {
                                bgcolor: '#2563eb',
                            },
                        }}
                    >
                        Nouveau Contact
                    </Button>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <Avatar
                        sx={{
                            bgcolor: '#e0f2fe',
                            color: '#0284c7',
                            width: 28,
                            height: 28,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                        }}
                    >
                        {filteredContacts.length}
                    </Avatar>
                    <Typography sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                        contact{filteredContacts.length !== 1 ? 's' : ''} trouvé{filteredContacts.length !== 1 ? 's' : ''}
                    </Typography>
                </Box>

                <ContactsList
                    contacts={filteredContacts}
                    onEdit={handleEdit}
                    onDelete={deleteContact}
                />
            </Paper>

            <ContactForm
                open={isFormOpen}
                onClose={handleClose}
                onSubmit={handleSubmit}
                initialData={editingContact}
            />
        </Box>
    );
};

export default Contacts;
