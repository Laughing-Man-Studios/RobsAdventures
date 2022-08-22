export function toTitleCase(text: string): string {
    return text.toLowerCase()
      .split(' ')
      .map((s: string) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ');
  }
  
  export function labelToDatabaseName(text: string) {
    return text.split('/')[1].replaceAll(' ','_').toUpperCase();
  }