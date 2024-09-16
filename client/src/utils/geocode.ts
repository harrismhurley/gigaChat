// utils/geocode.ts
export const getCoordinatesFromAddress = (address: string): Promise<{ lat: number, lng: number }> => {
    return new Promise((resolve, reject) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
                const location = results[0].geometry.location;
                resolve({ lat: location.lat(), lng: location.lng() });
            } else {
                reject(new Error(`Geocode was not successful for the following reason: ${status}`));
            }
        });
    });
};
