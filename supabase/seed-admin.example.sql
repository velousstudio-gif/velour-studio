-- Ejecutar en Supabase → SQL Editor DESPUÉS de crear el usuario en Authentication → Users.
-- Reemplazá el email por el del usuario creado. Sin fila en `profiles` nadie accede al CRM.
insert into public.profiles (id, email, full_name, role)
select id, email, 'Tu nombre', 'admin'
from auth.users
where email = 'tu-email@ejemplo.com';

-- Para sumar un colaborador (solo verá los leads que le asignes):
-- insert into public.profiles (id, email, full_name, role)
-- select id, email, 'Nombre Colaborador', 'colaborador' from auth.users where email = 'colaborador@ejemplo.com';

-- Para dar de baja a alguien sin borrar su historial:
-- update public.profiles set active = false where email = 'colaborador@ejemplo.com';
