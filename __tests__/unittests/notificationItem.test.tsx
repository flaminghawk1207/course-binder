import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { NotificationItem } from '~/Components/AppNotifications';
import { Notification } from '~/types';
import '@testing-library/jest-dom'
const maxLengthNotTrucated = 25;
const truncatedMessage = (message: string) =>
    message.length > maxLengthNotTrucated
        ? `${message.substring(0, 25)}...`
        : message;

describe('NotificationItem', () => {
    const notification: Notification = {
        email: 'test@example.com',
        message: 'This is a test notification message',
        channel_code: 'channel',
        time: 1623539100,
        viewed: false,
    };

    it('renders the notification channel code', () => {
        render(<NotificationItem notification={notification} />);
        const messageElement = screen.getByText(truncatedMessage(notification.message));
        expect(messageElement).toBeInTheDocument();
    });

    it('renders the full message if it is shorter than or equal to maxLengthNotTrucated', () => {
        const shortMessage = 'This is a short message';
        render(<NotificationItem notification={{...notification, message: shortMessage}} />);
        const message = screen.getByText(shortMessage);
        expect(message).toBeInTheDocument();
    });

    it('truncates and shows "Read more" when the message is longer than maxLengthNotTrucated and is not expanded', () => {
        const longMessage = 'This is a very long message that exceeds the maxLengthNotTrucated value';
        render(<NotificationItem notification={{ ...notification, message: longMessage }} />);
        const truncMessage = screen.getByText(truncatedMessage(longMessage));
        const readMoreButton = screen.getByText('Read more');
        expect(truncMessage).toBeInTheDocument();
        expect(readMoreButton).toBeInTheDocument();
        expect(screen.queryByText('Read less')).toBeNull();
    });

    it('shows the full message and "Read less" when expanded is true', () => {
        const longMessage = 'This is a very long message that exceeds the maxLengthNotTrucated value';
        render(<NotificationItem notification={{ ...notification, message: longMessage }} />);
        fireEvent.click(screen.getByText('Read more'));
        const fullMessage = screen.getByText(longMessage);
        const readLessButton = screen.getByText('Read less');
        expect(fullMessage).toBeInTheDocument();
        expect(readLessButton).toBeInTheDocument();
        expect(screen.queryByText('Read more')).toBeNull();
    });

    it('toggles the expanded state and shows/hides the correct buttons when "Read more" or "Read less" is clicked', () => {
        const longMessage = 'This is a very long message that exceeds the maxLengthNotTrucated value';
        render(<NotificationItem notification={{ ...notification, message: longMessage }} />);
        let readMoreButton = screen.getByText('Read more');
        expect(readMoreButton).toBeInTheDocument();

        // Click "Read more" button
        fireEvent.click(readMoreButton);
        expect(screen.queryByText('Read more')).toBeNull();
        const readLessButton = screen.queryByText('Read less');
        expect(readLessButton).toBeInTheDocument();

        // Click "Read less" button
        fireEvent.click(readLessButton!);
        expect(screen.queryByText('Read less')).toBeNull();
        readMoreButton = screen.getByText('Read more');
        expect(readMoreButton).toBeInTheDocument();
    });
});
