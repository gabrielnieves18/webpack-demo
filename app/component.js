export default (text = 'Hello world') => {
    const element = document.createElement('div');
    
    element.innerHTML = `
    <h1>${text}</h1>
    <div><p>Welcome to my <strong>dev</strong> server.</p></div>
    `;
    
    return(element);
};