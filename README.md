# 🛒 OtaHub – Tienda de Mangas (React + Django REST)

OtaHub es una plataforma web que permite visualizar categorías de mangas, ver sus detalles y gestionarlos dentro de un carrito de compras.  
El proyecto está dividido en dos partes:

- **Backend:** Django + Django REST Framework  
- **Frontend:** React + Vite

Este desarrollo cumple con los requisitos solicitados: gestión de inventario, API operativa, Home con listado de productos, vista de detalle y carrito funcional.

---

## 🚀 Tecnologías utilizadas

### **Backend (Django + DRF)**
- Django  
- Django REST Framework  
- Django CORS Headers  
- Pillow (para imágenes)

### **Frontend (React + Vite)**
- React  
- React Router DOM  

---

# 📁 Estructura general del proyecto
OtaHub/ <br>
├── backend/ <br>
│ ├── manage.py <br>
│ ├── requirements.txt <br>
│ ├── api/              (categorías, productos, endpoints) <br>
│ ├── media/            (imágenes de productos) <br>
│ └── config/           (settings, urls) <br>
│ <br>
└── frontend/ <br>
   ├── index.html <br>
   ├── package.json <br>
   ├── src/ <br>
   │   ├── pages/ <br>
   │   ├── components/ <br>
   │   └── App.jsx <br>
   └── vite.config.js <br>

---

# 📦 Dependencias

## 🔹 Backend – Instalación de dependencias

Dentro de la carpeta del backend:

```bash
pip install django
pip install djangorestframework
pip install pillow
pip install django-cors-headers
```
(Opcional) Crear archivo requirements.txt:
```bash
pip freeze > requirements.txt
```
## 🔹 Frontend – Instalación de dependencias
```bash
Dentro de la carpeta del frontend:
npm install react-router-dom
(El resto de dependencias base las instala Vite automáticamente.)
```
