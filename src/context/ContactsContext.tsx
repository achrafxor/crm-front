import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Contact } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface ContactsContextType {
    contacts: Contact[];
    addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateContact: (id: string, contact: Partial<Contact>) => void;
    deleteContact: (id: string) => void;
    getContact: (id: string) => Contact | undefined;
}

const ContactsContext = createContext<ContactsContextType | undefined>(undefined);

export const useContacts = () => {
    const context = useContext(ContactsContext);
    if (!context) {
        throw new Error('useContacts must be used within a ContactsProvider');
    }
    return context;
};

export const ContactsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [contacts, setContacts] = useState<Contact[]>(() => {
        const saved = localStorage.getItem('crm_contacts');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('crm_contacts', JSON.stringify(contacts));
    }, [contacts]);

    const addContact = (data: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newContact: Contact = {
            ...data,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setContacts(prev => [...prev, newContact]);
    };

    const updateContact = (id: string, updates: Partial<Contact>) => {
        setContacts(prev => prev.map(c =>
            c.id === id
                ? { ...c, ...updates, updatedAt: new Date().toISOString() }
                : c
        ));
    };

    const deleteContact = (id: string) => {
        setContacts(prev => prev.filter(c => c.id !== id));
    };

    const getContact = (id: string) => contacts.find(c => c.id === id);

    return (
        <ContactsContext.Provider value={{ contacts, addContact, updateContact, deleteContact, getContact }}>
            {children}
        </ContactsContext.Provider>
    );
};
