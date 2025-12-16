import React, { useState } from 'react';
import { Typography, Box, Button, GridLegacy as Grid } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useContacts } from '../context/ContactsContext';
import ContactsList from '../components/contacts/ContactsList';
import ContactForm from '../components/contacts/ContactForm';
import type { Contact } from '../types';

const Contacts = () => {
    const { contacts, addContact, updateContact, deleteContact } = useContacts();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | undefined>(undefined);

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

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Contacts</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreate}>
                    New Contact
                </Button>
            </Box>

            <ContactsList
                contacts={contacts}
                onEdit={handleEdit}
                onDelete={deleteContact}
            />

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
