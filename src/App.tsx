import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

function App() {
	return (
		<>
			<RegistrationForm />
		</>
	);
}

export default App;

// 1. Описываем схему валидации с помощью Zod
const registrationSchema = z
	.object({
		username: z
			.string()
			.min(3, 'Имя должно быть не менее 3 символов')
			.max(20, 'Имя слишком длинное'),
		email: z.string().email('Введите корректный email'),
		password: z
			.string()
			.min(8, 'Пароль должен быть не менее 8 символов')
			.regex(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву'),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Пароли не совпадают',
		path: ['confirmPassword'], // Ошибка привяжется к этому полю
	});

// 2. Извлекаем тип из схемы (Type Inference)
type RegistrationFormValues = z.infer<typeof registrationSchema>;

export const RegistrationForm = () => {
	// 3. Инициализируем форму
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<RegistrationFormValues>({
		resolver: zodResolver(registrationSchema), // Подключаем Zod
		mode: 'onTouched', // Валидация сработает, когда пользователь "потрогал" поле и ушел с него
	});

	const onSubmit = (data: RegistrationFormValues) => {
		console.log('Данные формы валидны:', data);
		// Здесь обычно идет вызов API
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}
		>
			<div>
				<label>Имя пользователя:</label>
				<input {...register('username')} />
				{errors.username && <p style={{ color: 'red' }}>{errors.username.message}</p>}
			</div>

			<div>
				<label>Email:</label>
				<input {...register('email')} />
				{errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
			</div>

			<div>
				<label>Пароль:</label>
				<input type="password" {...register('password')} />
				{errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
			</div>

			<div>
				<label>Подтвердите пароль:</label>
				<input type="password" {...register('confirmPassword')} />
				{errors.confirmPassword && <p style={{ color: 'red' }}>{errors.confirmPassword.message}</p>}
			</div>

			<button type="submit" disabled={isSubmitting}>
				{isSubmitting ? 'Отправка...' : 'Зарегистрироваться'}
			</button>
		</form>
	);
};
