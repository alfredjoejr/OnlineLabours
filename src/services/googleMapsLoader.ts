// Google Maps JavaScript API Dynamic Loader Service

declare global {
  interface Window {
    google?: any;
    __googleMapsLoadingPromise?: Promise<any>;
  }
}

export const getGoogleMapsApiKey = (): string => {
  return (import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '').trim();
};

export const isGoogleMapsKeyConfigured = (): boolean => {
  const key = getGoogleMapsApiKey();
  return key.length > 0 && key !== 'YOUR_GOOGLE_MAPS_API_KEY';
};

export const loadGoogleMapsScript = (): Promise<any> => {
  if (!isGoogleMapsKeyConfigured()) {
    return Promise.resolve(null);
  }

  if (window.google?.maps) {
    return Promise.resolve(window.google.maps);
  }

  if (window.__googleMapsLoadingPromise) {
    return window.__googleMapsLoadingPromise;
  }

  window.__googleMapsLoadingPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById('google-maps-sdk-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.google?.maps));
      existingScript.addEventListener('error', (e) => reject(e));
      return;
    }

    const apiKey = getGoogleMapsApiKey();
    const script = document.createElement('script');
    script.id = 'google-maps-sdk-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&loading=async`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.google?.maps) {
        resolve(window.google.maps);
      } else {
        reject(new Error('Google Maps SDK loaded but google.maps object is missing.'));
      }
    };

    script.onerror = (error) => {
      console.warn('Google Maps SDK failed to load. Check your API key and permissions:', error);
      reject(error);
    };

    document.head.appendChild(script);
  });

  return window.__googleMapsLoadingPromise;
};

export interface LatLngLocation {
  lat: number;
  lng: number;
}

export interface GeocodedPlace {
  address: string;
  lat: number;
  lng: number;
  city?: string;
  district?: string;
  postalCode?: string;
}

// Sri Lanka default center (Colombo)
export const DEFAULT_SRI_LANKA_CENTER: LatLngLocation = {
  lat: 6.9271,
  lng: 79.8612,
};

// Sri Lanka popular locations for smart fallback suggestions
export const SRI_LANKAN_PRESET_LOCATIONS: GeocodedPlace[] = [
  { address: 'Colombo 03 (Kollupitiya), Western Province', city: 'Colombo 03', lat: 6.9147, lng: 79.8528 },
  { address: 'Colombo 05 (Havelock Town / Narahenpita)', city: 'Colombo 05', lat: 6.8868, lng: 79.8732 },
  { address: 'Colombo 07 (Cinnamon Gardens), Western Province', city: 'Colombo 07', lat: 6.9099, lng: 79.8687 },
  { address: 'Nugegoda, Colombo Suburbs', city: 'Nugegoda', lat: 6.8718, lng: 79.8988 },
  { address: 'Dehiwala-Mount Lavinia, Western Province', city: 'Dehiwala', lat: 6.8402, lng: 79.8712 },
  { address: 'Battaramulla / Rajagiriya, Sri Jayawardenepura Kotte', city: 'Battaramulla', lat: 6.8996, lng: 79.9194 },
  { address: 'Negombo City Center, Gampaha District', city: 'Negombo', lat: 7.2008, lng: 79.8736 },
  { address: 'Kandy City, Central Province', city: 'Kandy', lat: 7.2906, lng: 80.6337 },
  { address: 'Galle Fort & Town, Southern Province', city: 'Galle', lat: 6.0535, lng: 80.2210 },
  { address: 'Kurunegala Town, North Western Province', city: 'Kurunegala', lat: 7.4863, lng: 80.3623 },
  { address: 'Jaffna City Center, Northern Province', city: 'Jaffna', lat: 9.6615, lng: 80.0255 },
];
