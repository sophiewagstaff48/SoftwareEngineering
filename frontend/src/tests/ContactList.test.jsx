import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContactList from '../ContactList';

// Mock data and functions
const mockContacts = [
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
];

const mockUpdateContact = jest.fn();
const mockUpdateCallback = jest.fn();

// Mock fetch for the delete operation
global.fetch = jest.fn(() =>
    Promise.resolve({
        status: 200,
        json: () => Promise.resolve({ message: 'User deleted' }),
    })
);

describe('ContactList Component', () => {
    beforeEach(() => {
        fetch.mockClear();
        mockUpdateContact.mockClear();
        mockUpdateCallback.mockClear();
    });

    test('renders contacts correctly', () => {
        render(
            <ContactList
                contacts={mockContacts}
                updateContact={mockUpdateContact}
                updateCallback={mockUpdateCallback}
            />
        );
        
        expect(screen.getByText('John')).toBeInTheDocument();
        expect(screen.getByText('Doe')).toBeInTheDocument();
        expect(screen.getByText('john@example.com')).toBeInTheDocument();
        expect(screen.getByText('Jane')).toBeInTheDocument();
        expect(screen.getByText('Smith')).toBeInTheDocument();
    });

    test('calls updateContact when Update button is clicked', () => {
        render(
            <ContactList
                contacts={mockContacts}
                updateContact={mockUpdateContact}
                updateCallback={mockUpdateCallback}
            />
        );

        // Find all Update buttons and click the first one
        const updateButtons = screen.getAllByText('Update');
        fireEvent.click(updateButtons[0]);

        expect(mockUpdateContact).toHaveBeenCalledWith(mockContacts[0]);
    });

    test('calls delete API when Delete button is clicked', async () => {
        render(
            <ContactList
                contacts={mockContacts}
                updateContact={mockUpdateContact}
                updateCallback={mockUpdateCallback}
            />
        );

        // Find all Delete buttons and click the first one
        const deleteButtons = screen.getAllByText('Delete');
        fireEvent.click(deleteButtons[0]);

        expect(fetch).toHaveBeenCalledWith(
            'http://127.0.0.1:5000/delete_contact/1',
            { method: 'DELETE' }
        );

        // Wait for the async deletion to complete
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(mockUpdateCallback).toHaveBeenCalled();
    });
});