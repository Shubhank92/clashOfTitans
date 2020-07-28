const createAutoComplete = ({ root, renderOption, onOptionSelect, inputValue, fetchData }) => {
    root.innerHTML = `
        <label><b>Search Here</b></label>
        <input class="input" />
        <div class="dropdown">
            <div class="dropdown-menu">
                <div class="dropdown-content results"></div>
            </div>
        </div>
    `;

    const input = root.querySelector('input');
    const dropdown = root.querySelector('.dropdown');
    const resWrapper = root.querySelector('.results');

    const onInput = debounce(async (e) => {
        const elements = await fetchData(e.target.value);
        if (elements === undefined) {
            dropdown.classList.remove('is-active');
        }
        else {
            resWrapper.innerHTML = '';
            dropdown.classList.add('is-active');
            for (let element of elements) {
                const option = document.createElement('a');
                
                option.classList.add('dropdown-item');
                option.innerHTML = renderOption(element);
                option.addEventListener('click', () => {
                    input.value = inputValue(element);
                    dropdown.classList.remove('is-active');
                    onOptionSelect(element);
                });
                resWrapper.appendChild(option);
            }
        }
    })

    input.addEventListener('input', onInput);

    document.addEventListener('click', event => {
        if(!root.contains(event.target)) {
            dropdown.classList.remove('is-active');
        }
    })
} 