import React, { createContext, useContext, useState } from 'react';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
const [profile, setProfile] = useState({
name: 'Restaurant User',
email: 'user@example.com',
});

const updateProfile = (newProfile) => {
setProfile(previousProfile => ({
...previousProfile,
...newProfile,
}));
};

return (
<ProfileContext.Provider value={{ profile, updateProfile }}>
{children}
</ProfileContext.Provider>
);
};

export const useProfile = () => useContext(ProfileContext);