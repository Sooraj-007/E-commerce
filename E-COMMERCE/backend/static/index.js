const API_URL = "http://localhost:5000/catalogues";

function showForm(type) {
    document.getElementById('output').innerHTML = '';
    let html = '';
    if ((type === 'update') || (type === 'get') || (type === 'delete')) {
        html += `<div class="form-group">
                    <label>Catalogue ID:</label>
                    <input type="number" id="catalogue_id" min="1" required>
                </div>`;
    }
    if (type === 'create' || type === 'update') {
    html += `<div class="form-group">
                <label>Catalogue Name:</label>
                <input type="text" id="cat_name" required>
            </div>
            <div class="form-group">
                <label>Catalogue Description:</label>
                <input type="text" id="cat_description" required>
            </div>
            <div class="form-group">
                <label>Effective From (YYYY-MM-DD):</label>
                <input type="date" id="cat_from" required>
            </div>
            <div class="form-group">
                <label>Effective To (YYYY-MM-DD):</label>
                <input type="date" id="cat_to" required>
            </div>
            <div class="form-group">
                <label>Status:</label>
                <select id="cat_status" class="status-select">
                    <option value="Active" selected>Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>`;
}

    html += `<div class="actions">`;
    if (type === 'create') {
        html += `<button onclick="createCatalogue()">Create</button>`;
    } else if (type === 'get') {
        html += `<button onclick="getCatalogue()">Get</button>`;
    } else if (type === 'update') {
        html += `<button class="action-btn update-btn" onclick="updateCatalogue()">Update</button>`;
    } else if (type === 'delete') {
        html += `<button onclick="deleteCatalogue()">Delete</button>`;
    }
    html += `<button onclick="clearForm()">Cancel</button></div>`;
    document.getElementById('form-section').innerHTML = html;
}

function clearForm() {
    document.getElementById('form-section').innerHTML = '';
    document.getElementById('output').innerHTML = '';
}

function showAllCatalogues() {
    fetch(`${API_URL}`)
        .then(res => res.json())
        .then(response => {
            const data = response.data;
            let html = `<h3>All Catalogues</h3>`;
            html += `<table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>From</th>
                                <th>To</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>`;

            data.forEach(cat => {
                const statusClass = cat.status?.toLowerCase() === 'active' ? 'status-active' : 'status-inactive';
                html += `<tr>
                    <td>${cat.catalogue_id}</td>
                    <td>${cat.catalogue_name}</td>
                    <td>${cat.catalogue_description}</td>
                    <td>${cat.start_date}</td>
                    <td>${cat.end_date}</td>
                    <td><span class="${statusClass}">${cat.status}</span></td>
                    <td>
                        <button onclick="showUpdateForm(${cat.catalogue_id}, '${cat.catalogue_name}', '${cat.catalogue_description}', '${cat.start_date}', '${cat.end_date}', '${cat.status}')">Update</button>
                        <button onclick="deleteCatalogueById(${cat.catalogue_id})">Delete</button>
                    </td>
                </tr>`;
            });

            html += `</tbody></table>`;
            document.getElementById('all-catalogues-section').innerHTML = html;
        })
        .catch(err => {
            document.getElementById('all-catalogues-section').innerHTML = `<p class="error">Failed to fetch catalogues: ${err}</p>`;
        });
}

function createCatalogue() {
    let catalogue_name = document.getElementById('cat_name').value.trim();
    let catalogue_description = document.getElementById('cat_description').value.trim();
    let start_date = document.getElementById('cat_from').value;
    let end_date = document.getElementById('cat_to').value;
    let status = document.getElementById('cat_status').value;

    if (!catalogue_name || !catalogue_description || !start_date || !end_date) {
        document.getElementById('output').innerHTML = `<span class="error">All fields are required.</span>`;
        return;
    }

    fetch(API_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            catalogue_name,
            catalogue_description,
            start_date,
            end_date,
            status
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            document.getElementById('output').innerHTML = `<span class="error">${data.error}</span>`;
        } else {
            document.getElementById('output').innerHTML = `<span class="success">Catalogue created successfully.</span>`;
            clearForm();
            showAllCatalogues();
        }
    })
    .catch(err => {
        document.getElementById('output').innerHTML = `<span class="error">Network error: ${err}</span>`;
    });
}

function getCatalogue() {
    let id = parseInt(document.getElementById('cat_id').value);
    if (!id) {
        document.getElementById('output').innerHTML = `<span class="error">Catalogue ID is required.</span>`;
        return;
    }
    fetch(`${API_URL}/${id}`)
        .then(res => res.json())
        .then(cat => {
            if (cat.error) {
                document.getElementById('output').innerHTML = `<span class="error">${cat.error}</span>`;
            } else {
                const statusValue = (cat.status || "").toLowerCase();
                const statusClass = statusValue === "active" ? "status-active" : "status-inactive";
                let html = `
                    <div>
                        <strong>ID:</strong> ${cat.id}<br>
                        <strong>Name:</strong> ${cat.name}<br>
                        <strong>Description:</strong> ${cat.description}<br>
                        <strong>Effective From:</strong> ${cat.effective_from}<br>
                        <strong>Effective To:</strong> ${cat.effective_to}<br>
                        <strong>Status:</strong> <span class="${statusClass}">${cat.status}</span>
                        <div style="margin-top:18px;">
                            <button class="table-action-btn update" onclick="showUpdateForm(${cat.id}, '${cat.name}', '${cat.description}', '${cat.effective_from}', '${cat.effective_to}', '${cat.status}')">Edit</button>
                            <button class="table-action-btn delete" onclick="deleteCatalogueById(${cat.id})">Delete</button>
                        </div>
                    </div>
                `;
                document.getElementById('output').innerHTML = html;
            }
        })
        .catch(err => {
            document.getElementById('output').innerHTML = `<span class="error">Network error: ${err}</span>`;
        });
}

function showUpdateForm(id, name, description, from, to, status = "ACTIVE") {
    const statusValue = (status || "ACTIVE").toLowerCase();
    let html = `
        <h3>Update Catalogue</h3>
        <div class="form-group">
            <label>Name:</label>
            <input type="text" id="cat_name" value="${name}" required>
        </div>
        <div class="form-group">
            <label>Description:</label>
            <input type="text" id="cat_description" value="${description}" required>
        </div>
        <div class="form-group">
            <label>Effective From:</label>
            <input type="date" id="cat_from" value="${from}" required>
        </div>
        <div class="form-group">
            <label>Effective To:</label>
            <input type="date" id="cat_to" value="${to}" required>
        </div>
        <div class="form-group">
            <label>Status:</label>
            <select id="cat_status">
                <option value="ACTIVE" ${statusValue === "active" ? "selected" : ""}>ACTIVE</option>
                <option value="INACTIVE" ${statusValue === "inactive" ? "selected" : ""}>INACTIVE</option>
            </select>
        </div>
        <div class="actions">
            <button onclick="updateCatalogueById(${id})">Update</button>
            <button onclick="clearForm()">Cancel</button>
        </div>
    `;
    document.getElementById('output').innerHTML = html;
}


function showUpdateForm(id, name, description, from, to, status = "ACTIVE") {
    const statusValue = (status || "ACTIVE").toLowerCase();
    let html = `
        <h3>Update Catalogue</h3>
        <div class="form-group">
            <label>Name:</label>
            <input type="text" id="cat_name" value="${name}" required>
        </div>
        <div class="form-group">
            <label>Description:</label>
            <input type="text" id="cat_description" value="${description}" required>
        </div>
        <div class="form-group">
            <label>Effective From:</label>
            <input type="date" id="cat_from" value="${from}" required>
        </div>
        <div class="form-group">
            <label>Effective To:</label>
            <input type="date" id="cat_to" value="${to}" required>
        </div>
        <div class="form-group">
            <label>Status:</label>
            <select id="cat_status">
                <option value="ACTIVE" ${statusValue === "active" ? "selected" : ""}>ACTIVE</option>
                <option value="INACTIVE" ${statusValue === "inactive" ? "selected" : ""}>INACTIVE</option>
            </select>
        </div>
        <div class="actions">
            <button onclick="updateCatalogueById(${id})">Update</button>
            <button onclick="clearForm()">Cancel</button>
        </div>
    `;
    document.getElementById('output').innerHTML = html;
}

function deleteCatalogueById(id) {
    if (!confirm("Are you sure you want to delete this catalogue?")) return;
    fetch(`${API_URL}/${id}`, {method: "DELETE"})
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                document.getElementById('output').innerHTML = `<span class="error">${data.error}</span>`;
            } else {
                document.getElementById('output').innerHTML = `<span class="success">Catalogue deleted successfully.</span>`;
                showAllCatalogues();
            }
        })
        .catch(err => {
            document.getElementById('output').innerHTML = `<span class="error">Network error: ${err}</span>`;
        });
}

function exitSystem() {
    if (confirm("Are you sure you want to exit the Catalogue Management System?")) {
        document.body.innerHTML = "<h2 style='text-align:center;margin-top:100px;'>Thank you for using the Catalogue Management System.</h2>";
    }
}

window.onload = showAllCatalogues;
