import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Chip,
    TextField,
    Box,
    InputAdornment
} from '@mui/material';
import { Edit, Delete, Search } from '@mui/icons-material';
import type { Contact } from '../../types';

interface Props {
    contacts: Contact[];
    onEdit: (contact: Contact) => void;
    onDelete: (id: string) => void;
}

const ContactsList = ({ contacts, onEdit, onDelete }: Props) => {
    const [search, setSearch] = useState('');

    const filteredContacts = contacts.filter(c =>
        c.firstName.toLowerCase().includes(search.toLowerCase()) ||
        c.lastName.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Paper>
            <Box sx={{ p: 2 }}>
                <TextField
                    size="small"
                    placeholder="Search contacts..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                    fullWidth
                    sx={{ maxWidth: 300 }}
                />
            </Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Source</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredContacts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">No contacts found</TableCell>
                            </TableRow>
                        ) : (
                            filteredContacts.map((contact) => (
                                <TableRow key={contact.id}>
                                    <TableCell>{contact.firstName} {contact.lastName}</TableCell>
                                    <TableCell>{contact.email}</TableCell>
                                    <TableCell>{contact.phone}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={contact.type}
                                            color={contact.type === 'SELLER' ? 'secondary' : 'primary'}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>{contact.source || '-'}</TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" onClick={() => onEdit(contact)}><Edit fontSize="small" /></IconButton>
                                        <IconButton size="small" onClick={() => onDelete(contact.id)} color="error"><Delete fontSize="small" /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default ContactsList;
