import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserList from '../UserList';


// Mock data and functions
const mockUsers = [
    { id: 1, userName: 'John', email: 'john@example.com', password: '1234' },
    { id: 2, userName: 'Jane', email: 'jane@example.com', password: '4321' },
];

const mockUpdateUser = jest.fn();
const mockUpdateCallback = jest.fn();

// Mock fetch for the delete operation
global.fetch = jest.fn(() =>
    Promise.resolve({
        status: 200,
        json: () => Promise.resolve({ message: 'User deleted' }),
    })
);

describe('UserList Component', () => {
    beforeEach(() => {
        fetch.mockClear();
        mockUpdateUser.mockClear();
        mockUpdateCallback.mockClear();
    });

    test('renders users correctly', () => {
        render(
            <UserList
                users={mockUsers}
                updateUser={mockUpdateUser}
                updateCallback={mockUpdateCallback}
            />
        );
        
        expect(screen.getByText('John')).toBeInTheDocument();
        expect(screen.getByText('john@example.com')).toBeInTheDocument();
        expect(screen.getByText('1234')).toBeInTheDocument();
        expect(screen.getByText('Jane')).toBeInTheDocument();
        expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });

    test('calls updateUser when Update button is clicked', () => {
        render(
            <UserList
                users={mockUsers}
                updateUser={mockUpdateUser}
                updateCallback={mockUpdateCallback}
            />
        );

        // Find all Update buttons and click the first one
        const updateButtons = screen.getAllByText('Update');
        fireEvent.click(updateButtons[0]);

        expect(mockUpdateUser).toHaveBeenCalledWith(mockUsers[0]);
    });

    test('calls delete API when Delete button is clicked', async () => {
        render(
            <UserList
                users={mockUsers}
                updateUser={mockUpdateUser}
                updateCallback={mockUpdateCallback}
            />
        );

        // Find all Delete buttons and click the first one
        const deleteButtons = screen.getAllByText('Delete');
        fireEvent.click(deleteButtons[0]);

        expect(fetch).toHaveBeenCalledWith(
            'http://127.0.0.1:5000/delete_user/1',
            { method: 'DELETE' }
        );

        // Wait for the async deletion to complete
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(mockUpdateCallback).toHaveBeenCalled();
    });
});