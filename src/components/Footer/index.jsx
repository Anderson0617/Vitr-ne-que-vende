import { Facebook, Instagram, Phone } from "lucide-react";
import React from "react";
import { FaWhatsapp } from "react-icons/fa";

import {
	Copyright,
	FooterContainer,
	FooterTitle,
	InfoSection,
	SocialLink,
	SocialLinks,
} from "./styles";

const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<FooterContainer>
			<FooterTitle>Site à espera de um dono</FooterTitle>

			<SocialLinks>
				<SocialLink
					href="https://www.threads.com/@oliveiraandersonjose"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="Instagram"
				>
					<Instagram size={28} />
				</SocialLink>
				<SocialLink
					href="https://www.facebook.com/share/1F4duPA8Xs/"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="Facebook"
				>
					<Facebook size={28} />
				</SocialLink>

				<SocialLink
					href="https://wa.me/5548991691906"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="WhatsApp"
				>
					<FaWhatsapp size={28} color="#25D366" />
				</SocialLink>

			</SocialLinks>

			<InfoSection>
				<h3>Florianópolis e regiãos 📍</h3>
				<p>Aberto de Segunda à Sábado, 10:00 - 16:00 as 18:00 - 24:00</p>
				<div style={{ width: '100%', maxWidth: '900px', borderRadius: '15px', overflow: 'hidden', margin: '0 auto' }}>
					<iframe
						src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3584.019784580728!2d-48.54717778497174!3d-27.595914982834753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9527370c6f06c7b5%3A0x9f64f912f0a2c1ee!2sMercado%20P%C3%BAblico%20Municipal%20de%20Florian%C3%B3polis!5e0!3m2!1spt-BR!2sbr!4v1692050448615!5m2!1spt-BR!2sbr"
						width="100%"
						height="250"
						style={{ border: 0 }}
						allowFullScreen
						loading="lazy"
						referrerPolicy="no-referrer-when-downgrade"
					/>
				</div>

			</InfoSection>

			<Copyright>
				&copy; {currentYear} Todos os direitos reservados À Anderson Oliveira.
			</Copyright>
		</FooterContainer>
	);
};

export default Footer;
