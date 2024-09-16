// src/utils/loadScript.ts

export const loadScript = (src: string, id: string, callback?: () => void): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if the script is already added
      const existingScript = document.getElementById(id);
      if (existingScript) {
        resolve();
        if (callback) callback();
        return;
      }
  
      const script = document.createElement('script');
      script.src = src;
      script.id = id;
      script.async = true;
      script.onload = () => {
        resolve();
        if (callback) callback();
      };
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
  
      document.body.appendChild(script);
    });
  };
  