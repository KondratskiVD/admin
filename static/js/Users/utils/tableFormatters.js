var switchFormatter = (ctx) => {
    const containerEl = ctx.parentElement;
    $(containerEl).addClass('n-visibility');
    $(containerEl).removeClass('d-visibility');
    $(containerEl).siblings().addClass('d-visibility');
    $(containerEl).siblings().removeClass('n-visibility');
}
var closeEditor = (ctx, id, roles) => {
    const containerEl = ctx.parentElement.parentElement;
    $(containerEl).addClass('n-visibility');
    $(containerEl).removeClass('d-visibility');
    $(containerEl).prev().addClass('d-visibility');
    $(containerEl).prev().removeClass('n-visibility');
}
var editUser = (ctx, id) => {
    $(ctx).find('.icon__16x16').addClass('hidden');
    $(ctx).find('.preview-loader__white').removeClass('hidden');
    const roles = userTableFormatters.allUserRows.get(+id);
    updateUserAPI(+id, roles).then(res => {
        if (res.ok) {
            setTimeout(() => {
                $(ctx).find('.icon__16x16').removeClass('hidden');
                $(ctx).find('.preview-loader__white').addClass('hidden');
                showNotify('SUCCESS', 'Roles updated');
                closeEditor(ctx, id, roles.join(','));
                const element = document.getElementById(`user_${+id}__text`);
                element.textContent = roles.join(', ');
            }, 500);
        }
    })
}

var selectRole = (ctx, id, roles, e) => {
    const clickedRole = $(ctx).siblings().text();
    let newSelectedRoles = [];
    if (e.target.checked) {
        newSelectedRoles = [ ...userTableFormatters.allUserRows.get(+id), clickedRole];
    } else {
        newSelectedRoles = userTableFormatters.allUserRows.get(+id).filter(r => r !== clickedRole);
    }
    userTableFormatters.allUserRows.set(+id, newSelectedRoles);
    const element = document.getElementById(`user_${id}`);
    element.textContent = newSelectedRoles.join(', ');
}

var userTableFormatters = {
    allUserRows: new Map(),
    selectRoleFormatter(value, row, index, field, existedRoles) {

        const optionList = existedRoles.map((role) => {
            const isChecked = row.roles.includes(role) ? 'checked' : '';
            return `
                <li class="dropdown-menu_item px-3 py-2">
                    <label class='w-100 d-flex align-items-center custom-checkbox'>
                        <input class='mr-2' type='checkbox' ${isChecked} onchange="selectRole(this, '${row.id}', '${row.roles}', event)">
                        <span class='w-100 d-inline-block'>${role}</span>
                    </label>
                </li>`
        }).join('');
        userTableFormatters.allUserRows.set(row.id, row.roles);
        const buttonText = row.roles.length ? `${row.roles.join(', ')}` : 'select role'
        return `
            <div class="w-175" style="margin: -4px 0;">
                <div class="d-flex justify-content-between d-visibility">
                    <span id="user_${row.id}__text">${row.roles.join(', ')}</span>
                    <button type="button" class="btn btn-default btn-xs btn-table btn-icon__xs edit_user" onclick="switchFormatter(this)"
                        data-toggle="tooltip" data-placement="top">
                        <i class="icon__18x18 icon-edit"></i>
                    </button>
                </div>
                <div class="n-visibility d-flex">
                    <div class="dropdown_simple-list flex-grow-1">
                        <button type="button"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                            class="btn btn-select btn-select__sm dropdown-toggle d-inline-flex align-items-center w-100"
                        >
                            <span class="complex-list_filled w-100" align="left" id="user_${row.id}">
                                ${buttonText}
                            </span>
                        </button>
                        <ul class="dropdown-menu close-outside">
                            ${optionList}
                        </ul>
                    </div>
                    <div class="d-flex justify-content-end align-items-center">
                        <button class="btn btn-success__custom btn-xs btn-icon__xs ml-2" onclick="editUser(this, '${row.id}')">
                            <i class="icon__16x16 icon-check__white"></i>
                            <i class="preview-loader__white hidden"></i>
                        </button>
                        <button class="btn btn-secondary btn-xs btn-icon__xs ml-2" onclick="closeEditor(this, '${row.id}', '${row.roles}')">
                            <i class="icon__16x16 icon-close__16"></i>
                        </button>
                    </div>   
                </div>
            </div>    
        `
    },
    action(value, row, index) {
        return `
            <button type="button" class="btn btn-default btn-xs btn-table btn-icon__xs delete_user">
                <i class="icon__18x18 icon-delete"></i>
            </button>
        `
    },
    action_events: {
        "click .delete_user": function (e, value, row, index) {
            vueVm.registered_components.UsersPage.showConfirmModal = true;
        },
    }
}