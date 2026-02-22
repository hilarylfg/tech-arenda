import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL ?? ''
})
const prisma = new PrismaClient({ adapter: adapter as any } as any)

async function main() {
	console.log('🌱 Начинаем заполнение базы данных...')

	// Очищаем таблицы в правильном порядке
	await prisma.orderItem.deleteMany()
	await prisma.order.deleteMany()
	await prisma.equipment.deleteMany()
	await prisma.category.deleteMany()
	await prisma.user.deleteMany()

	// Создаём категории
	const categories = await Promise.all([
		prisma.category.create({
			data: {
				name: 'Экскаваторы',
				slug: 'excavators',
				description:
					'Гусеничные и колёсные экскаваторы для земляных работ',
				icon: '🚜',
				sortOrder: 1
			}
		}),
		prisma.category.create({
			data: {
				name: 'Краны',
				slug: 'cranes',
				description: 'Автокраны и башенные краны для подъёма грузов',
				icon: '🏗️',
				sortOrder: 2
			}
		}),
		prisma.category.create({
			data: {
				name: 'Погрузчики',
				slug: 'loaders',
				description: 'Фронтальные и вилочные погрузчики',
				icon: '🚛',
				sortOrder: 3
			}
		}),
		prisma.category.create({
			data: {
				name: 'Бульдозеры',
				slug: 'bulldozers',
				description: 'Бульдозеры для планировки и разработки грунта',
				icon: '🏕️',
				sortOrder: 4
			}
		}),
		prisma.category.create({
			data: {
				name: 'Дорожная техника',
				slug: 'road-machinery',
				description: 'Катки, асфальтоукладчики, грейдеры',
				icon: '🛣️',
				sortOrder: 5
			}
		})
	])

	const [excavators, cranes, loaders, bulldozers, roadMachinery] = categories

	console.log(`✅ Создано ${categories.length} категорий`)

	// Создаём технику
	const equipment = await Promise.all([
		// Экскаваторы
		prisma.equipment.create({
			data: {
				name: 'Гусеничный экскаватор Caterpillar 320',
				slug: 'caterpillar-320',
				description:
					'Гусеничный экскаватор среднего класса для широкого спектра строительных и горных работ. Отличается высокой производительностью, надёжностью и экономичностью в эксплуатации.',
				categoryId: excavators.id,
				pricePerDay: 45000,
				pricePerWeek: 270000,
				pricePerMonth: 900000,
				status: 'AVAILABLE',
				manufacturer: 'Caterpillar',
				model: '320',
				year: 2021,
				location: 'г. Москва, склад №1',
				images: [
					'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800'
				],
				specifications: {
					Вес: '20 000 кг',
					'Мощность двигателя': '122 кВт',
					'Глубина копания': '6,7 м',
					'Вылет стрелы': '10,2 м',
					'Объём ковша': '0,8 м³'
				}
			}
		}),
		prisma.equipment.create({
			data: {
				name: 'Колёсный экскаватор Komatsu PW160',
				slug: 'komatsu-pw160',
				description:
					'Колёсный экскаватор для работы в городских условиях и на дорожных объектах. Высокая мобильность и возможность перемещения своим ходом.',
				categoryId: excavators.id,
				pricePerDay: 38000,
				pricePerWeek: 228000,
				pricePerMonth: 760000,
				status: 'AVAILABLE',
				manufacturer: 'Komatsu',
				model: 'PW160',
				year: 2020,
				location: 'г. Москва, склад №2',
				images: [
					'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'
				],
				specifications: {
					Вес: '16 500 кг',
					'Мощность двигателя': '105 кВт',
					'Глубина копания': '5,8 м',
					'Объём ковша': '0,6 м³',
					'Скорость передвижения': '36 км/ч'
				}
			}
		}),
		prisma.equipment.create({
			data: {
				name: 'Мини-экскаватор JCB 8026',
				slug: 'jcb-8026',
				description:
					'Компактный мини-экскаватор для работы в стеснённых условиях, внутри помещений и в труднодоступных местах.',
				categoryId: excavators.id,
				pricePerDay: 12000,
				pricePerWeek: 72000,
				pricePerMonth: 240000,
				status: 'AVAILABLE',
				manufacturer: 'JCB',
				model: '8026',
				year: 2022,
				location: 'г. Москва, склад №1',
				images: [
					'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'
				],
				specifications: {
					Вес: '2 600 кг',
					'Мощность двигателя': '17,6 кВт',
					'Глубина копания': '2,67 м',
					'Объём ковша': '0,07 м³',
					Ширина: '1,35 м'
				}
			}
		}),
		// Краны
		prisma.equipment.create({
			data: {
				name: 'Автокран Liebherr LTM 1100',
				slug: 'liebherr-ltm-1100',
				description:
					'Мощный автокран грузоподъёмностью 100 тонн. Идеален для монтажных работ на промышленных объектах и высотного строительства.',
				categoryId: cranes.id,
				pricePerDay: 85000,
				pricePerWeek: 510000,
				pricePerMonth: 1700000,
				status: 'AVAILABLE',
				manufacturer: 'Liebherr',
				model: 'LTM 1100',
				year: 2019,
				location: 'г. Москва, склад №3',
				images: [
					'https://images.unsplash.com/photo-1590644365607-47c3b4b68a5b?w=800'
				],
				specifications: {
					Грузоподъёмность: '100 т',
					'Длина стрелы': '60 м',
					'Высота подъёма': '82 м',
					'Мощность двигателя': '400 кВт',
					'Скорость подъёма': '120 м/мин'
				}
			}
		}),
		prisma.equipment.create({
			data: {
				name: 'Автокран Tadano ATF 70G',
				slug: 'tadano-atf-70g',
				description:
					'Универсальный автокран грузоподъёмностью 70 тонн с телескопической стрелой. Отличается компактными размерами и высокой манёвренностью.',
				categoryId: cranes.id,
				pricePerDay: 65000,
				pricePerWeek: 390000,
				pricePerMonth: 1300000,
				status: 'RENTED',
				manufacturer: 'Tadano',
				model: 'ATF 70G',
				year: 2020,
				location: 'г. Москва, склад №3',
				images: [
					'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'
				],
				specifications: {
					Грузоподъёмность: '70 т',
					'Длина стрелы': '50 м',
					'Высота подъёма': '70 м',
					Оси: '5'
				}
			}
		}),
		// Погрузчики
		prisma.equipment.create({
			data: {
				name: 'Фронтальный погрузчик Volvo L90H',
				slug: 'volvo-l90h',
				description:
					'Компактный фронтальный погрузчик с высокой грузоподъёмностью. Применяется на строительных площадках, в карьерах и на складах.',
				categoryId: loaders.id,
				pricePerDay: 22000,
				pricePerWeek: 132000,
				pricePerMonth: 440000,
				status: 'AVAILABLE',
				manufacturer: 'Volvo',
				model: 'L90H',
				year: 2021,
				location: 'г. Москва, склад №2',
				images: [
					'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'
				],
				specifications: {
					Грузоподъёмность: '5 200 кг',
					'Объём ковша': '2,9 м³',
					'Мощность двигателя': '147 кВт',
					'Высота разгрузки': '2,9 м',
					Вес: '12 800 кг'
				}
			}
		}),
		prisma.equipment.create({
			data: {
				name: 'Телескопический погрузчик Manitou MT 1840',
				slug: 'manitou-mt-1840',
				description:
					'Телескопический погрузчик с большой высотой подъёма. Незаменим на строительстве и при работе с негабаритными грузами.',
				categoryId: loaders.id,
				pricePerDay: 18000,
				pricePerWeek: 108000,
				pricePerMonth: 360000,
				status: 'AVAILABLE',
				manufacturer: 'Manitou',
				model: 'MT 1840',
				year: 2022,
				location: 'г. Москва, склад №1',
				images: [
					'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800'
				],
				specifications: {
					Грузоподъёмность: '4 000 кг',
					'Высота подъёма': '18 м',
					'Мощность двигателя': '90 кВт',
					Привод: '4x4'
				}
			}
		}),
		// Бульдозеры
		prisma.equipment.create({
			data: {
				name: 'Бульдозер Komatsu D65EX',
				slug: 'komatsu-d65ex',
				description:
					'Гусеничный бульдозер среднего класса для планировки, разработки и перемещения грунта. Оснащён современной системой управления.',
				categoryId: bulldozers.id,
				pricePerDay: 55000,
				pricePerWeek: 330000,
				pricePerMonth: 1100000,
				status: 'AVAILABLE',
				manufacturer: 'Komatsu',
				model: 'D65EX',
				year: 2020,
				location: 'г. Москва, склад №2',
				images: [
					'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800'
				],
				specifications: {
					Вес: '21 815 кг',
					'Мощность двигателя': '168 кВт',
					'Ширина отвала': '3 975 мм',
					'Высота отвала': '1 295 мм',
					'Тяговое усилие': '196 кН'
				}
			}
		}),
		// Дорожная техника
		prisma.equipment.create({
			data: {
				name: 'Асфальтоукладчик Vogele SUPER 1800',
				slug: 'vogele-super-1800',
				description:
					'Высокопроизводительный асфальтоукладчик для строительства дорог и площадок. Обеспечивает высокое качество укладки.',
				categoryId: roadMachinery.id,
				pricePerDay: 75000,
				pricePerWeek: 450000,
				pricePerMonth: 1500000,
				status: 'AVAILABLE',
				manufacturer: 'Vogele',
				model: 'SUPER 1800',
				year: 2019,
				location: 'г. Москва, склад №3',
				images: [
					'https://images.unsplash.com/photo-1590644365607-47c3b4b68a5b?w=800'
				],
				specifications: {
					'Ширина укладки': '2,55–9,0 м',
					Производительность: 'до 900 т/ч',
					'Мощность двигателя': '129 кВт',
					'Толщина слоя': 'до 300 мм'
				}
			}
		}),
		prisma.equipment.create({
			data: {
				name: 'Дорожный каток Hamm HD+ 110',
				slug: 'hamm-hd-110',
				description:
					'Двухвальцовый вибрационный каток для уплотнения асфальтобетонных смесей при строительстве и ремонте дорог.',
				categoryId: roadMachinery.id,
				pricePerDay: 28000,
				pricePerWeek: 168000,
				pricePerMonth: 560000,
				status: 'AVAILABLE',
				manufacturer: 'Hamm',
				model: 'HD+ 110',
				year: 2021,
				location: 'г. Москва, склад №3',
				images: [
					'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'
				],
				specifications: {
					'Рабочая ширина': '1 680 мм',
					Вес: '11 000 кг',
					'Мощность двигателя': '75 кВт',
					'Амплитуда вибрации': '0,45 / 0,9 мм'
				}
			}
		})
	])

	console.log(`✅ Создано ${equipment.length} единиц техники`)

	// Создаём пользователей
	const adminPassword = await bcrypt.hash('admin123', 12)
	const clientPassword = await bcrypt.hash('client123', 12)

	const adminUser = await prisma.user.create({
		data: {
			email: 'admin@specaenda.ru',
			password: adminPassword,
			firstName: 'Александр',
			lastName: 'Петров',
			phone: '+7 (495) 000-00-01',
			role: 'ADMIN'
		}
	})

	const client1 = await prisma.user.create({
		data: {
			email: 'ivanov@example.com',
			password: clientPassword,
			firstName: 'Иван',
			lastName: 'Иванов',
			phone: '+7 (900) 123-45-67',
			role: 'CLIENT'
		}
	})

	const client2 = await prisma.user.create({
		data: {
			email: 'sidorov@example.com',
			password: clientPassword,
			firstName: 'Сергей',
			lastName: 'Сидоров',
			phone: '+7 (900) 987-65-43',
			role: 'CLIENT'
		}
	})

	console.log(`✅ Создано 3 пользователя (1 admin, 2 client)`)

	// Создаём тестовые заявки
	const startDate1 = new Date()
	startDate1.setDate(startDate1.getDate() + 3)
	const endDate1 = new Date(startDate1)
	endDate1.setDate(endDate1.getDate() + 7)

	const order1 = await prisma.order.create({
		data: {
			userId: client1.id,
			startDate: startDate1,
			endDate: endDate1,
			status: 'CONFIRMED',
			totalAmount: 315000,
			contactPhone: client1.phone!,
			comment: 'Нужен оператор',
			items: {
				create: [
					{
						equipmentId: equipment[0].id, // Caterpillar 320
						quantity: 1,
						price: equipment[0].pricePerDay
					}
				]
			}
		}
	})

	const startDate2 = new Date()
	const endDate2 = new Date()
	endDate2.setDate(endDate2.getDate() + 5)

	const order2 = await prisma.order.create({
		data: {
			userId: client2.id,
			startDate: startDate2,
			endDate: endDate2,
			status: 'ACTIVE',
			totalAmount: 110000,
			contactPhone: client2.phone!,
			items: {
				create: [
					{
						equipmentId: equipment[5].id, // Volvo L90H
						quantity: 1,
						price: equipment[5].pricePerDay
					}
				]
			}
		}
	})

	const startDate3 = new Date()
	startDate3.setDate(startDate3.getDate() - 10)
	const endDate3 = new Date()
	endDate3.setDate(endDate3.getDate() - 3)

	await prisma.order.create({
		data: {
			userId: client1.id,
			startDate: startDate3,
			endDate: endDate3,
			status: 'COMPLETED',
			totalAmount: 315000,
			contactPhone: client1.phone!,
			items: {
				create: [
					{
						equipmentId: equipment[3].id, // Liebherr LTM 1100
						quantity: 1,
						price: equipment[3].pricePerDay
					}
				]
			}
		}
	})

	console.log(`✅ Создано 3 тестовые заявки`)
	console.log('\n📋 Данные для входа:')
	console.log('   Администратор: admin@specaenda.ru / admin123')
	console.log('   Клиент 1:      ivanov@example.com / client123')
	console.log('   Клиент 2:      sidorov@example.com / client123')
	console.log('\n🎉 База данных заполнена успешно!')
}

main()
	.catch(e => {
		console.error('❌ Ошибка:', e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
