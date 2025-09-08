export const normalizeDates = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    
    const normalized = { ...obj };
    
    const dateFields = ['lastActivity', 'createdAt', 'updatedAt', 'lastSeen', 'timestamp', 'readAt'];
    
    dateFields.forEach(field => {
      if (normalized[field] && typeof normalized[field] === 'object') {
        normalized[field] = normalized[field].toISOString();
      }
    });
    
    Object.keys(normalized).forEach(key => {
      if (Array.isArray(normalized[key])) {
        normalized[key] = normalized[key].map(item => normalizeDates(item));
      } else if (typeof normalized[key] === 'object' && normalized[key] !== null) {
        normalized[key] = normalizeDates(normalized[key]);
      }
    });
    
    return normalized;
  };
  
  export const denormalizeDates = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    
    const denormalized = { ...obj };
    
    const dateFields = ['lastActivity', 'createdAt', 'updatedAt', 'lastSeen', 'timestamp', 'readAt'];
    
    dateFields.forEach(field => {
      if (denormalized[field] && typeof denormalized[field] === 'string') {
        denormalized[field] = new Date(denormalized[field]);
      }
    });
    
    Object.keys(denormalized).forEach(key => {
      if (Array.isArray(denormalized[key])) {
        denormalized[key] = denormalized[key].map(item => denormalizeDates(item));
      } else if (typeof denormalized[key] === 'object' && denormalized[key] !== null) {
        denormalized[key] = denormalizeDates(denormalized[key]);
      }
    });
    
    return denormalized;
  };