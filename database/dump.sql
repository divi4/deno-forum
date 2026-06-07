--
-- PostgreSQL database dump
--

\restrict lOGiHcG27pfegcbWb4HTO3QFYxPMkvWzidhpDxOjtWzGdscico3RAmDQjyIFsG1

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: hidden_posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hidden_posts (
    post_id integer NOT NULL,
    hidden_by_username character varying(50) NOT NULL,
    hidden_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.hidden_posts OWNER TO postgres;

--
-- Name: posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.posts (
    id integer NOT NULL,
    owner_username character varying(50),
    title character varying(255) NOT NULL,
    link character varying(500) NOT NULL,
    description text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    post_rating integer DEFAULT 0
);


ALTER TABLE public.posts OWNER TO postgres;

--
-- Name: posts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.posts_id_seq OWNER TO postgres;

--
-- Name: posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.posts_id_seq OWNED BY public.posts.id;


--
-- Name: ratings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ratings (
    post_id integer NOT NULL,
    rated_by_username character varying(50) NOT NULL,
    is_like boolean,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    points_processed boolean DEFAULT false
);


ALTER TABLE public.ratings OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    username character varying(50) NOT NULL,
    password_hash character(60) NOT NULL COLLATE pg_catalog."C",
    creation_points integer DEFAULT 100,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: posts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public.posts_id_seq'::regclass);


--
-- Data for Name: hidden_posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hidden_posts (post_id, hidden_by_username, hidden_at) FROM stdin;
27	whisper2	2026-06-07 21:08:09.463948
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.posts (id, owner_username, title, link, description, created_at, post_rating) FROM stdin;
33	davo	Straight into the 'vibes' folder	https://app.leonardo.ai/generation/image/ultra-realistic-magnificently-designed-futuristic-108eedda-f9b7-4f55-9f1a-5232f40529bf	Ultra-realistic but cool alien	2026-06-07 21:17:08.159888	1
30	whisper2	Spent way too many credits on this one. No regrets	https://app.leonardo.ai/generation/image/intense-extreme-close-up-portrait-elderly-d3d7a141-3384-4923-a6e8-ff6b279fb0e7	A Native American with a wolf	2026-06-07 21:11:36.426285	-1
31	davo	I asked for 'weird little guy' and… yeah. Meet him.	https://app.leonardo.ai/generation/image/bizarre-intriguing-little-man-unusual-aura-having-6498a182-73a6-4eeb-bd5f-3b67ef52bb9e	A weird little guy	2026-06-07 21:12:55.387654	3
27	davo	My first fine-tuned LoRA: turning cat photos into Renaissance portraits 🐱🎨	https://app.leonardo.ai/generation/image/artistic-portrait-photography-majestic-cat-96d9f5e0-ad6e-4bbb-9aee-644c0b5a7f11	Artistic portrait of a majestic renaissance cat	2026-06-07 20:25:20.770916	-1
32	baconlover	This is how my brain feels at 1am	https://app.leonardo.ai/generation/image/telegram-sticker-sized-transparent-background-06fff242-3bd8-40c5-8190-8d98135e4d68	A tired Meerkat having coffee	2026-06-07 21:15:14.013016	-2
29	baconlover	Why does my model keep generating neon-colored squirrels?	https://app.leonardo.ai/generation/image/neon-squirrel-want-5544c264-790b-4499-aed2-8cd90547f2be	Seriously I just want a normal squirrel	2026-06-07 20:41:30.726231	2
28	whisper2	Accidentally stumbled into a latent space that generates cool album covers 🤯	https://app.leonardo.ai/generation/image/faded-polaroid-lonely-convenience-store-2am-neon-881f79d8-f8f7-4fed-a29f-666224904826	faded polaroid of a lonely convenience store at 2am	2026-06-07 20:29:58.408191	3
35	baconlover	What genre of music does this look like?	https://app.leonardo.ai/generation/image/ms-paint-drawing-pixelated-free-hand-continuous-2de6ec52-b23f-44ae-b65f-1b3e8ad4c72d?utm_source=share_asset	'MS-Paint' style prompt	2026-06-07 21:23:15.39775	0
34	whisper2	Just gonna leave this here	https://app.leonardo.ai/generation/image/cute-3d-cartoon-character-representing-varicocele-9e29bb1a-0441-4ba2-af6b-c7f86f820e7d	A cute wool monster	2026-06-07 21:18:10.356673	2
\.


--
-- Data for Name: ratings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ratings (post_id, rated_by_username, is_like, created_at, points_processed) FROM stdin;
28	davo	t	2026-06-07 21:07:11.674863	t
28	baconlover	t	2026-06-07 20:37:45.423792	t
28	whisper2	t	2026-06-07 21:06:52.578748	t
35	baconlover	t	2026-06-07 21:23:15.451492	f
34	whisper2	t	2026-06-07 21:18:10.410902	t
34	baconlover	t	2026-06-07 21:18:26.37761	t
33	davo	t	2026-06-07 21:17:08.214131	t
33	baconlover	f	2026-06-07 21:19:24.921897	t
33	whisper2	t	2026-06-07 21:20:11.701886	t
30	baconlover	f	2026-06-07 21:19:43.278927	t
30	whisper2	f	2026-06-07 21:20:17.05692	t
31	davo	t	2026-06-07 21:12:55.441277	t
31	baconlover	t	2026-06-07 21:19:36.266757	t
31	whisper2	t	2026-06-07 21:20:22.549047	t
27	baconlover	f	2026-06-07 20:37:55.871877	t
27	whisper2	f	2026-06-07 21:07:46.053891	t
27	davo	t	2026-06-07 21:20:52.78558	t
32	baconlover	f	2026-06-07 21:19:29.869252	t
32	davo	f	2026-06-07 21:20:58.016957	t
29	baconlover	t	2026-06-07 20:41:41.651643	t
29	whisper2	t	2026-06-07 21:06:56.26201	t
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (username, password_hash, creation_points, created_at) FROM stdin;
whisper2	$2b$12$mQCxqcNZdO//xzDVZ8Bf6uhhpAVh9OSfqQSkNBZvw0LFYQqCULoba	109	2026-05-24 12:52:56.467553
davo	$2b$12$0/tOKCXjytoibK/GQB0nwOoTQIyOh3iSerzR5qcdJqD0gWi/lL0Ce	97	2026-05-24 12:52:17.825293
baconlover	$2b$12$8ubH.GZJT80XGHmk1d/68O2dS1ZSkm6vSLSaac5OHPb5I4DdlkfyG	107	2026-05-24 12:52:47.987199
\.


--
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.posts_id_seq', 35, true);


--
-- Name: hidden_posts hidden_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hidden_posts
    ADD CONSTRAINT hidden_posts_pkey PRIMARY KEY (post_id, hidden_by_username);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: ratings ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_pkey PRIMARY KEY (post_id, rated_by_username);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (username);


--
-- Name: hidden_posts hidden_posts_hidden_by_username_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hidden_posts
    ADD CONSTRAINT hidden_posts_hidden_by_username_fkey FOREIGN KEY (hidden_by_username) REFERENCES public.users(username) ON DELETE CASCADE;


--
-- Name: hidden_posts hidden_posts_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hidden_posts
    ADD CONSTRAINT hidden_posts_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: posts posts_owner_username_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_owner_username_fkey FOREIGN KEY (owner_username) REFERENCES public.users(username);


--
-- Name: ratings ratings_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: ratings ratings_rated_by_username_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_rated_by_username_fkey FOREIGN KEY (rated_by_username) REFERENCES public.users(username) ON DELETE CASCADE;


--
-- Name: TABLE hidden_posts; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.hidden_posts TO itech3108;


--
-- Name: TABLE posts; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.posts TO itech3108;


--
-- Name: SEQUENCE posts_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT USAGE ON SEQUENCE public.posts_id_seq TO itech3108;


--
-- Name: TABLE ratings; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.ratings TO itech3108;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.users TO itech3108;


--
-- PostgreSQL database dump complete
--

\unrestrict lOGiHcG27pfegcbWb4HTO3QFYxPMkvWzidhpDxOjtWzGdscico3RAmDQjyIFsG1

