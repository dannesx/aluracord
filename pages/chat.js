import { Box, Text, TextField, Image, Button } from '@skynexui/components'
import React from 'react'
import appConfig from '../config.json'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/router'
import { ButtonSendSticker } from '../src/components/ButtonSendSticker'

const SUPABASE_ANON_KEY =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMwMDc2NSwiZXhwIjoxOTU4ODc2NzY1fQ.ZYRuQ-5AhbFA5jmJZgg68tbawiEfN6zDZDG8ZErdkjA'
const SUPABASE_URL = 'https://swrgltikzdaonnahdrpl.supabase.co'
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

function listenRealTimeMessages(addMessage) {
	return supabaseClient
		.from('messages')
		.on('INSERT', liveResponse => {
			addMessage(liveResponse.new)
		})
		.subscribe()
}

function Background() {
	return (
		<>
			<video autoPlay muted loop>
				<source src="/matrix.mp4" type="video/mp4" />
			</video>
			<style jsx>{`
				video {
					position: absolute;
					z-index: -100;
					width: 100vw;
					height: 100vh;
					object-fit: cover;
				}
			`}</style>
		</>
	)
}

export default function ChatPage() {
	const [message, setMessage] = React.useState('')
	const [messageList, setMessageList] = React.useState([])

	const router = useRouter()
	const { username } = router.query

	React.useEffect(() => {
		supabaseClient
			.from('messages')
			.select('*')
			.order('id', { ascending: false })
			.then(({ data }) => {
				setMessageList(data)
			})

		listenRealTimeMessages(newMessage => {
			setMessageList(currentList => {
				return [newMessage, ...currentList]
			})
		})
	}, [])

	const handleNewMessage = newMessage => {
		const message = {
			from: username,
			text: newMessage,
		}

		supabaseClient
			.from('messages')
			.insert([message])
			.then(({ data }) => {
				console.log('Criando mensagem: ', data)
			})

		setMessage('')
	}
	return (
		<>
			<Background />
			<Box
				styleSheet={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Box
					styleSheet={{
						display: 'flex',
						flexDirection: 'column',
						flex: 1,
						boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
						borderRadius: '5px',
						backgroundColor: appConfig.theme.colors.neutrals[700],
						height: '100%',
						maxWidth: '95%',
						maxHeight: '95vh',
						padding: '32px',
					}}
				>
					<Header username={username} />
					<Box
						styleSheet={{
							position: 'relative',
							display: 'flex',
							flex: 1,
							height: '80%',
							backgroundColor: appConfig.theme.colors.neutrals[600],
							flexDirection: 'column',
							borderRadius: '5px',
							padding: '16px',
						}}
					>
						<MessageList messages={messageList} />

						<Box
							as="form"
							styleSheet={{
								display: 'flex',
							}}
						>
							<TextField
								value={message}
								onChange={e => setMessage(e.target.value)}
								onKeyPress={e => {
									if (e.key === 'Enter') {
										e.preventDefault()
										handleNewMessage(e.target.value)
									}
								}}
								placeholder="Insira sua mensagem aqui..."
								type="textarea"
								styleSheet={{
									width: '100%',
									border: '0',
									resize: 'none',
									borderRadius: '5px',
									padding: '6px 8px',
									backgroundColor: appConfig.theme.colors.neutrals[800],
									marginRight: '12px',
									color: appConfig.theme.colors.neutrals[200],
								}}
							/>
							<ButtonSendSticker
								onStickerClick={sticker => {
									handleNewMessage(`:sticker:${sticker}`)
								}}
							/>
							<Button
								styleSheet={{
									minHeight: '50px',
									minWidth: '50px',
									marginLeft: '8px',
								}}
								onClick={e => handleNewMessage(message)}
								iconName="arrowRight"
								buttonColors={{
									contrastColor: appConfig.theme.colors.neutrals['000'],
									mainColor: appConfig.theme.colors.primary[500],
									mainColorLight: appConfig.theme.colors.primary[400],
									mainColorStrong: appConfig.theme.colors.primary[600],
								}}
							/>
						</Box>
					</Box>
				</Box>
			</Box>
		</>
	)
}

function Header({ username }) {
	return (
		<>
			<Box
				styleSheet={{
					width: '100%',
					marginBottom: '16px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<Text variant="heading5">Chat</Text>
				<Box
					styleSheet={{
						display: 'flex',
						alignItems: 'center',
						gap: '10px',
					}}
				>
					<Image
						styleSheet={{
							width: '48px',
							borderRadius: '50%',
							display: 'inline-block',
						}}
						src={`https://github.com/${username}.png`}
						alt={username}
						onError={e => {
							e.target.onerror = null
							e.target.src = '/github-placeholder.png'
						}}
					/>
					<Box
						styleSheet={{
							display: 'flex',
							flexDirection: 'column',
							gap: '4px',
						}}
					>
						<Text variant="body4">Logado como</Text>
						<Text variant="heading5">{username}</Text>
					</Box>
				</Box>
				<Button
					variant="tertiary"
					colorVariant="neutral"
					label="Logout"
					href="/"
				/>
			</Box>
		</>
	)
}

function MessageList(props) {
	return (
		<Box
			tag="ul"
			styleSheet={{
				overflowY: 'scroll',
				display: 'flex',
				flexDirection: 'column-reverse',
				flex: 1,
				color: appConfig.theme.colors.neutrals['000'],
				marginBottom: '16px',
			}}
		>
			{props.messages.map(message => {
				const time = Date.parse(message.created_at)
				return (
					<Text
						key={message.id}
						tag="li"
						styleSheet={{
							display: 'grid',
							gridTemplateColumns: '50px 1fr',
							gap: '8px',
							borderRadius: '5px',
							padding: '6px',
							marginBottom: '12px',
							hover: {
								backgroundColor: appConfig.theme.colors.neutrals[700],
							},
						}}
					>
						<Box styleSheet={{ width: '48px', height: '48px' }}>
							<Image
								styleSheet={{
									borderRadius: '50%',
									display: 'inline-block',
								}}
								src={`https://github.com/${message.from}.png`}
								alt={message.from}
								onError={e => {
									e.target.onerror = null
									e.target.src = '/github-placeholder.png'
								}}
							/>
						</Box>
						<Box
							styleSheet={{
								display: 'flex',
								flexDirection: 'column',
							}}
						>
							<Box styleSheet={{ marginBottom: '8px', wordWrap: 'break-word' }}>
								<Text tag="strong">{message.from}</Text>
								<Text
									styleSheet={{
										fontSize: '10px',
										marginLeft: '8px',
										color: appConfig.theme.colors.neutrals[300],
									}}
									tag="span"
								>
									{new Date(time).toLocaleTimeString('pt-BR').slice(0, -3)} |{' '}
									{new Date(time).toLocaleDateString('pt-BR')}
								</Text>
							</Box>
							{message.text.startsWith(':sticker:') ? (
								<Image
									styleSheet={{ maxWidth: '400px', width: '100%' }}
									src={message.text.replace(':sticker:', '')}
									alt="sticker"
								/>
							) : (
								message.text
							)}
						</Box>
					</Text>
				)
			})}
		</Box>
	)
}
