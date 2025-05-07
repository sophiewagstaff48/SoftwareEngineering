import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';


// Mock fetch to avoid actual API calls during testing
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ users: [] }),
    })
);

describe('App Component', () => {
    beforeEach(() => {
        fetch.mockClear();
    });
});