import { ClickAwayListener, Button, Badge, Popper } from "@mui/material"
import { useContext, useEffect, useState } from "react";

import NotificationsIcon from '@mui/icons-material/Notifications';
import { Notification } from "~/types";
import { apiReq } from "~/utils";
import { UserContext } from "~/contexts/UserProvider";

const NotificationItem = ({ notification }: { notification: Notification }) => {
    const [expanded, setExpanded] = useState(false);

    const maxLengthNotTrucated = 25;
    return (
        <div className={`w-full border-2 ${notification.viewed ? "bg-secondary-color" : "bg-hovercolor"}`}>
            <div className="w-full">
                {notification.channel}
            </div>
                {notification.message.length <= maxLengthNotTrucated
                    ? <div className="w-full h-full">
                        {notification.message}
                        </div>
                    : expanded? 
                    <div className="w-full h-full">
                        {notification.message}
                        <div onClick={() => setExpanded(false)} >Read less</div>
                    </div>
                    :
                    <div className="w-full h-full flex flex-row">
                        {notification.message.substring(0, maxLengthNotTrucated)}...
                        <div onClick={() => setExpanded(true)} >Read more</div>
                    </div>
                }
        </div>
    )
}

export const AppNotifications = () => {

    const { user } = useContext(UserContext);

    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        (async () => {
            await refreshNotifications();
        })()
    }, [])

    const refreshNotifications = async () => {
        const notifications = await apiReq("users", {
            type: "GET_NOTIFICATIONS",
            email: user?.email,
            limit: 10,
        })

        setNotifications(notifications);

        setTimeout(() => refreshNotifications(), 5000);
    }

    // Notification popup stuff
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    }

    const handleNotificationClickAway = () => {
        setAnchorEl(null);
    }

    const numberUnread = notifications.filter((notification: Notification) => !notification.viewed).length;

    if(open && numberUnread) {
        // Mark notifications as viewed after 1 second of opening the popup
        setTimeout(async () => {
                await apiReq("users", {
                    type: "MARK_NOTIFICATIONS_VIEWED",
                    email: user?.email,
                })
                await refreshNotifications();
        }, 1000);
    }
    return (
        <ClickAwayListener onClickAway={handleNotificationClickAway}>
            <div className="w-full justify-center text-center">
                <Button onClick={handleNotificationClick} className='inline-block bg-primary-color rounded-3xl'>
                    <Badge badgeContent={numberUnread} color="error">
                        <NotificationsIcon />
                    </Badge>
                </Button>
                <Popper open={open} anchorEl={anchorEl} placement='right'>
                    <div className="w-80 h-48 overflow-auto no-scrollbar bg-secondary-color">
                            {
                                notifications.map((notification: Notification) =>
                                    <NotificationItem notification={notification} />
                                )
                            }
                    </div>
                </Popper>
            </div>
        </ClickAwayListener>
    )
}