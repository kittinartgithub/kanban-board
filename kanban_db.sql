--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-07-07 21:21:10

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
-- TOC entry 232 (class 1259 OID 16531)
-- Name: board_invitations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.board_invitations (
    id integer NOT NULL,
    board_id integer,
    invited_user_id integer,
    invited_by_user_id integer,
    status character varying(20) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    responded_at timestamp without time zone
);


ALTER TABLE public.board_invitations OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16530)
-- Name: board_invitations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.board_invitations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.board_invitations_id_seq OWNER TO postgres;

--
-- TOC entry 5032 (class 0 OID 0)
-- Dependencies: 231
-- Name: board_invitations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.board_invitations_id_seq OWNED BY public.board_invitations.id;


--
-- TOC entry 221 (class 1259 OID 16418)
-- Name: board_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.board_members (
    board_id integer,
    user_id integer
);


ALTER TABLE public.board_members OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16405)
-- Name: boards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.boards (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    owner_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.boards OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16404)
-- Name: boards_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.boards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.boards_id_seq OWNER TO postgres;

--
-- TOC entry 5033 (class 0 OID 0)
-- Dependencies: 219
-- Name: boards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.boards_id_seq OWNED BY public.boards.id;


--
-- TOC entry 223 (class 1259 OID 16432)
-- Name: columns; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.columns (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    board_id integer
);


ALTER TABLE public.columns OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16431)
-- Name: columns_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.columns_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.columns_id_seq OWNER TO postgres;

--
-- TOC entry 5034 (class 0 OID 0)
-- Dependencies: 222
-- Name: columns_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.columns_id_seq OWNED BY public.columns.id;


--
-- TOC entry 234 (class 1259 OID 16555)
-- Name: invitations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invitations (
    id integer NOT NULL,
    board_id integer NOT NULL,
    inviter_id integer NOT NULL,
    invitee_id integer NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    responded_at timestamp with time zone
);


ALTER TABLE public.invitations OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16554)
-- Name: invitations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.invitations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.invitations_id_seq OWNER TO postgres;

--
-- TOC entry 5035 (class 0 OID 0)
-- Dependencies: 233
-- Name: invitations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.invitations_id_seq OWNED BY public.invitations.id;


--
-- TOC entry 227 (class 1259 OID 16465)
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    user_id integer,
    title character varying(255) NOT NULL,
    message character varying(500),
    type character varying(50),
    related_id integer,
    is_read boolean,
    created_at timestamp with time zone DEFAULT now(),
    read_at timestamp with time zone,
    board_name character varying(255),
    inviter_name character varying(255),
    extra_data json
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16464)
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO postgres;

--
-- TOC entry 5036 (class 0 OID 0)
-- Dependencies: 226
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- TOC entry 229 (class 1259 OID 16481)
-- Name: tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tags (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.tags OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16480)
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tags_id_seq OWNER TO postgres;

--
-- TOC entry 5037 (class 0 OID 0)
-- Dependencies: 228
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;


--
-- TOC entry 236 (class 1259 OID 16582)
-- Name: task_assignees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.task_assignees (
    id integer NOT NULL,
    task_id integer NOT NULL,
    user_id integer NOT NULL,
    assigned_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.task_assignees OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16581)
-- Name: task_assignees_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.task_assignees_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.task_assignees_id_seq OWNER TO postgres;

--
-- TOC entry 5038 (class 0 OID 0)
-- Dependencies: 235
-- Name: task_assignees_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.task_assignees_id_seq OWNED BY public.task_assignees.id;


--
-- TOC entry 230 (class 1259 OID 16490)
-- Name: task_tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.task_tags (
    task_id integer,
    tag_id integer
);


ALTER TABLE public.task_tags OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16445)
-- Name: tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tasks (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    column_id integer,
    assignee_id integer,
    "position" integer
);


ALTER TABLE public.tasks OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16444)
-- Name: tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tasks_id_seq OWNER TO postgres;

--
-- TOC entry 5039 (class 0 OID 0)
-- Dependencies: 224
-- Name: tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tasks_id_seq OWNED BY public.tasks.id;


--
-- TOC entry 218 (class 1259 OID 16390)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash text NOT NULL,
    first_name character varying(100),
    last_name character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16389)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5040 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4800 (class 2604 OID 16534)
-- Name: board_invitations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.board_invitations ALTER COLUMN id SET DEFAULT nextval('public.board_invitations_id_seq'::regclass);


--
-- TOC entry 4793 (class 2604 OID 16408)
-- Name: boards id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.boards ALTER COLUMN id SET DEFAULT nextval('public.boards_id_seq'::regclass);


--
-- TOC entry 4795 (class 2604 OID 16435)
-- Name: columns id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.columns ALTER COLUMN id SET DEFAULT nextval('public.columns_id_seq'::regclass);


--
-- TOC entry 4803 (class 2604 OID 16558)
-- Name: invitations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invitations ALTER COLUMN id SET DEFAULT nextval('public.invitations_id_seq'::regclass);


--
-- TOC entry 4797 (class 2604 OID 16468)
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- TOC entry 4799 (class 2604 OID 16484)
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- TOC entry 4806 (class 2604 OID 16585)
-- Name: task_assignees id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_assignees ALTER COLUMN id SET DEFAULT nextval('public.task_assignees_id_seq'::regclass);


--
-- TOC entry 4796 (class 2604 OID 16448)
-- Name: tasks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks ALTER COLUMN id SET DEFAULT nextval('public.tasks_id_seq'::regclass);


--
-- TOC entry 4790 (class 2604 OID 16393)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5022 (class 0 OID 16531)
-- Dependencies: 232
-- Data for Name: board_invitations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.board_invitations (id, board_id, invited_user_id, invited_by_user_id, status, created_at, responded_at) FROM stdin;
3	9	5	8	pending	2025-07-06 23:59:12.706946	\N
4	9	6	8	accepted	2025-07-07 00:13:18.068328	2025-07-07 00:17:33.301608
6	9	8	8	pending	2025-07-07 03:01:25.980951	\N
8	9	4	8	pending	2025-07-07 03:02:52.82837	\N
9	9	3	8	pending	2025-07-07 03:02:56.905398	\N
10	9	1	8	pending	2025-07-07 03:03:00.186488	\N
11	5	8	6	pending	2025-07-07 03:06:23.104861	\N
12	5	1	6	pending	2025-07-07 03:06:26.035701	\N
14	6	3	6	pending	2025-07-07 09:04:58.984426	\N
15	6	4	6	pending	2025-07-07 09:05:07.674079	\N
16	6	1	6	pending	2025-07-07 09:13:52.353145	\N
17	6	7	6	pending	2025-07-07 09:18:27.727919	\N
18	6	6	6	pending	2025-07-07 09:18:43.591973	\N
20	4	7	6	pending	2025-07-07 09:20:02.562819	\N
22	4	4	6	pending	2025-07-07 09:24:16.126865	\N
23	4	1	6	pending	2025-07-07 09:35:05.289626	\N
24	4	3	6	pending	2025-07-07 09:35:24.374264	\N
25	4	5	6	pending	2025-07-07 09:36:32.713061	\N
26	6	5	6	pending	2025-07-07 09:38:33.151323	\N
28	11	6	8	accepted	2025-07-07 09:48:54.949238	2025-07-07 10:01:18.448293
21	4	6	6	declined	2025-07-07 09:23:41.809341	2025-07-07 10:01:34.943299
5	9	6	8	accepted	2025-07-07 02:40:08.110685	2025-07-07 10:01:44.53393
29	7	7	6	pending	2025-07-07 10:10:20.149478	\N
30	7	8	6	accepted	2025-07-07 10:10:25.12978	2025-07-07 10:10:35.500927
27	11	8	8	accepted	2025-07-07 09:46:03.863543	2025-07-07 10:10:36.878629
19	4	8	6	accepted	2025-07-07 09:19:41.842075	2025-07-07 10:10:37.861379
13	6	8	6	accepted	2025-07-07 03:06:33.097297	2025-07-07 10:10:39.043261
31	12	6	8	pending	2025-07-07 10:32:05.961615	\N
32	12	7	8	pending	2025-07-07 10:44:13.18441	\N
34	13	6	8	accepted	2025-07-07 10:54:05.798432	2025-07-07 10:56:20.276093
35	13	7	8	accepted	2025-07-07 12:18:30.285602	2025-07-07 12:18:43.603312
36	13	7	8	pending	2025-07-07 12:32:07.54861	\N
37	13	6	8	pending	2025-07-07 12:32:15.757775	\N
38	13	8	8	accepted	2025-07-07 12:32:17.647428	2025-07-07 12:32:29.794659
39	14	8	6	accepted	2025-07-07 20:32:50.313222	2025-07-07 20:32:58.757067
40	14	7	6	declined	2025-07-07 20:34:16.204188	2025-07-07 20:34:22.575694
7	9	7	8	accepted	2025-07-07 03:01:42.17039	2025-07-07 20:41:24.189034
\.


--
-- TOC entry 5011 (class 0 OID 16418)
-- Dependencies: 221
-- Data for Name: board_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.board_members (board_id, user_id) FROM stdin;
2	7
4	6
5	6
6	6
7	6
8	7
9	8
10	8
9	6
11	8
11	6
7	8
4	8
6	8
12	8
13	8
13	6
13	7
14	6
14	8
9	7
\.


--
-- TOC entry 5010 (class 0 OID 16405)
-- Dependencies: 220
-- Data for Name: boards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.boards (id, name, owner_id, created_at) FROM stdin;
2	New Kanban Board	7	2025-07-05 15:34:50.396439+07
5	สวัสดี	6	2025-07-06 04:30:16.175035+07
6	ทดสอบ	6	2025-07-06 12:26:04.760631+07
4	55555ทอสอบ222222	6	2025-07-06 02:37:43.107002+07
7	55	6	2025-07-06 18:36:37.227499+07
8	เทส	7	2025-07-06 22:31:10.472109+07
9	บอร์ดใหม่	8	2025-07-06 22:58:08.976691+07
10	บอร์ด	8	2025-07-06 22:58:34.939425+07
11	0	8	2025-07-07 09:46:00.79077+07
12	ทดสอบการเชิญ	8	2025-07-07 10:31:56.771445+07
13	ทดสอบเชิญ2	8	2025-07-07 10:53:09.158645+07
14	ทดสอบกดยืนยันแจ้งเตือน	6	2025-07-07 20:32:08.997788+07
\.


--
-- TOC entry 5013 (class 0 OID 16432)
-- Dependencies: 223
-- Data for Name: columns; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.columns (id, name, board_id) FROM stdin;
1	In Progress	2
5	5555	5
8	วันจันทร์	5
2	ทดสอบเพิ่มคอมลัม	\N
3	หหห	\N
4	255	\N
9	566556	\N
10	To Do	5
11	นิวคอมลัม	4
7	กกกากเทสจัง	4
12	1	4
13	2	4
14	3	4
15	project	6
17	77	7
18	77	6
20	ใหม่	4
21	78	5
22	แมว	5
23	ทดสอบเพิ่มทาสก์	13
24	การ์ด 3	13
25	ทดสอบแจ้งตือน	13
26	ทดสอบ	9
27	ทดสอบกดยื้นยันแจ้งเตือน	14
28	สฃ	9
\.


--
-- TOC entry 5024 (class 0 OID 16555)
-- Dependencies: 234
-- Data for Name: invitations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invitations (id, board_id, inviter_id, invitee_id, status, created_at, responded_at) FROM stdin;
\.


--
-- TOC entry 5017 (class 0 OID 16465)
-- Dependencies: 227
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, user_id, title, message, type, related_id, is_read, created_at, read_at, board_name, inviter_name, extra_data) FROM stdin;
1	7	คุณได้รับมอบหมายงานใหม่	Task: เขียน API Endpoint	task	3	f	2025-07-05 16:04:10.288473+07	\N	\N	\N	\N
2	5	คุณได้รับคำเชิญเข้าร่วมบอร์ด	Kittinart Jankaew ได้เชิญคุณเข้าร่วมบอร์ด 'บอร์ดใหม่'	invitation	3	f	2025-07-06 23:59:12.706946+07	\N	\N	\N	\N
3	6	คุณได้รับคำเชิญเข้าร่วมบอร์ด	Kittinart Jankaew ได้เชิญคุณเข้าร่วมบอร์ด 'บอร์ดใหม่'	invitation	4	f	2025-07-07 00:13:18.068328+07	\N	\N	\N	\N
4	6	คุณได้รับคำเชิญเข้าร่วมบอร์ด	Kittinart Jankaew ได้เชิญคุณเข้าร่วมบอร์ด 'บอร์ดใหม่'	invitation	5	f	2025-07-07 02:40:08.110685+07	\N	\N	\N	\N
5	8	คุณได้รับคำเชิญเข้าร่วมบอร์ด	Kittinart Jankaew ได้เชิญคุณเข้าร่วมบอร์ด 'บอร์ดใหม่'	invitation	6	f	2025-07-07 03:01:25.980951+07	\N	\N	\N	\N
6	7	คุณได้รับคำเชิญเข้าร่วมบอร์ด	Kittinart Jankaew ได้เชิญคุณเข้าร่วมบอร์ด 'บอร์ดใหม่'	invitation	7	f	2025-07-07 03:01:42.17039+07	\N	\N	\N	\N
7	4	คุณได้รับคำเชิญเข้าร่วมบอร์ด	Kittinart Jankaew ได้เชิญคุณเข้าร่วมบอร์ด 'บอร์ดใหม่'	invitation	8	f	2025-07-07 03:02:52.82837+07	\N	\N	\N	\N
8	3	คุณได้รับคำเชิญเข้าร่วมบอร์ด	Kittinart Jankaew ได้เชิญคุณเข้าร่วมบอร์ด 'บอร์ดใหม่'	invitation	9	f	2025-07-07 03:02:56.905398+07	\N	\N	\N	\N
9	1	คุณได้รับคำเชิญเข้าร่วมบอร์ด	Kittinart Jankaew ได้เชิญคุณเข้าร่วมบอร์ด 'บอร์ดใหม่'	invitation	10	f	2025-07-07 03:03:00.186488+07	\N	\N	\N	\N
10	8	คุณได้รับคำเชิญเข้าร่วมบอร์ด	test1 test1 ได้เชิญคุณเข้าร่วมบอร์ด 'สวัสดี'	invitation	11	f	2025-07-07 03:06:23.104861+07	\N	\N	\N	\N
11	1	คุณได้รับคำเชิญเข้าร่วมบอร์ด	test1 test1 ได้เชิญคุณเข้าร่วมบอร์ด 'สวัสดี'	invitation	12	f	2025-07-07 03:06:26.035701+07	\N	\N	\N	\N
12	8	คุณได้รับคำเชิญเข้าร่วมบอร์ด	test1 test1 ได้เชิญคุณเข้าร่วมบอร์ด 'ทดสอบ'	invitation	13	f	2025-07-07 03:06:33.097297+07	\N	\N	\N	\N
13	3	คุณได้รับคำเชิญเข้าร่วมบอร์ด	test1 test1 ได้เชิญคุณเข้าร่วมบอร์ด 'ทดสอบ'	invitation	14	f	2025-07-07 09:04:58.984426+07	\N	\N	\N	\N
14	4	คุณได้รับคำเชิญเข้าร่วมบอร์ด	test1 test1 ได้เชิญคุณเข้าร่วมบอร์ด 'ทดสอบ'	invitation	15	f	2025-07-07 09:05:07.674079+07	\N	\N	\N	\N
15	1	คุณได้รับคำเชิญเข้าร่วมบอร์ด	test1 test1 ได้เชิญคุณเข้าร่วมบอร์ด 'ทดสอบ'	invitation	16	f	2025-07-07 09:13:52.353145+07	\N	\N	\N	\N
16	7	คุณได้รับคำเชิญเข้าร่วมบอร์ด	test1 test1 ได้เชิญคุณเข้าร่วมบอร์ด 'ทดสอบ'	invitation	17	f	2025-07-07 09:18:27.727919+07	\N	\N	\N	\N
17	6	คุณได้รับคำเชิญเข้าร่วมบอร์ด	test1 test1 ได้เชิญคุณเข้าร่วมบอร์ด 'ทดสอบ'	invitation	18	f	2025-07-07 09:18:43.591973+07	\N	\N	\N	\N
18	8	คุณได้รับคำเชิญเข้าร่วมบอร์ด	test1 test1 ได้เชิญคุณเข้าร่วมบอร์ด '55555ทอสอบ222222'	invitation	19	f	2025-07-07 09:19:41.842075+07	\N	\N	\N	\N
19	7	คุณได้รับคำเชิญเข้าร่วมบอร์ด	test1 test1 ได้เชิญคุณเข้าร่วมบอร์ด '55555ทอสอบ222222'	invitation	20	f	2025-07-07 09:20:02.562819+07	\N	\N	\N	\N
20	6	คุณได้รับคำเชิญเข้าร่วมบอร์ด	test1 test1 ได้เชิญคุณเข้าร่วมบอร์ด '55555ทอสอบ222222'	invitation	21	f	2025-07-07 09:23:41.809341+07	\N	\N	\N	\N
21	4	คุณได้รับคำเชิญเข้าร่วมบอร์ด	test1 test1 ได้เชิญคุณเข้าร่วมบอร์ด '55555ทอสอบ222222'	invitation	22	f	2025-07-07 09:24:16.126865+07	\N	\N	\N	\N
22	1	คุณได้รับคำเชิญเข้าร่วมบอร์ด	test1 test1 ได้เชิญคุณเข้าร่วมบอร์ด '55555ทอสอบ222222'	invitation	23	f	2025-07-07 09:35:05.289626+07	\N	\N	\N	\N
23	3	คุณได้รับคำเชิญเข้าร่วมบอร์ด	test1 test1 ได้เชิญคุณเข้าร่วมบอร์ด '55555ทอสอบ222222'	invitation	24	f	2025-07-07 09:35:24.374264+07	\N	\N	\N	\N
24	5	คุณได้รับคำเชิญเข้าร่วมบอร์ด	test1 test1 ได้เชิญคุณเข้าร่วมบอร์ด '55555ทอสอบ222222'	invitation	25	f	2025-07-07 09:36:32.713061+07	\N	\N	\N	\N
25	5	คุณได้รับคำเชิญเข้าร่วมบอร์ด	test1 test1 ได้เชิญคุณเข้าร่วมบอร์ด 'ทดสอบ'	invitation	26	f	2025-07-07 09:38:33.151323+07	\N	\N	\N	\N
26	8	คุณได้รับคำเชิญเข้าร่วมบอร์ด	Kittinart Jankaew ได้เชิญคุณเข้าร่วมบอร์ด '0'	invitation	27	f	2025-07-07 09:46:03.863543+07	\N	\N	\N	\N
27	6	คุณได้รับคำเชิญเข้าร่วมบอร์ด	Kittinart Jankaew ได้เชิญคุณเข้าร่วมบอร์ด '0'	invitation	28	f	2025-07-07 09:48:54.949238+07	\N	\N	\N	\N
28	7	คุณได้รับคำเชิญเข้าร่วมบอร์ด	test1 test1 ได้เชิญคุณเข้าร่วมบอร์ด '55'	invitation	29	f	2025-07-07 10:10:20.149478+07	\N	\N	\N	\N
29	8	คุณได้รับคำเชิญเข้าร่วมบอร์ด	test1 test1 ได้เชิญคุณเข้าร่วมบอร์ด '55'	invitation	30	f	2025-07-07 10:10:25.12978+07	\N	\N	\N	\N
30	6	คุณได้รับคำเชิญเข้าร่วมบอร์ด	Kittinart Jankaew ได้เชิญคุณเข้าร่วมบอร์ด 'ทดสอบการเชิญ'	invitation	31	f	2025-07-07 10:32:05.961615+07	\N	\N	\N	\N
31	7	คุณได้รับคำเชิญเข้าร่วมบอร์ด	Kittinart Jankaew ได้เชิญคุณเข้าร่วมบอร์ด 'ทดสอบการเชิญ'	invitation	32	f	2025-07-07 10:44:13.18441+07	\N	\N	\N	\N
32	6	คุณได้รับคำเชิญเข้าร่วมบอร์ด	Kittinart Jankaew ได้เชิญคุณเข้าร่วมบอร์ด 'ทดสอบเชิญ2'	invitation	34	f	2025-07-07 10:54:05.798432+07	\N	ทดสอบเชิญ2	Kittinart Jankaew	\N
33	7	คุณได้รับคำเชิญเข้าร่วมบอร์ด	Kittinart Jankaew ได้เชิญคุณเข้าร่วมบอร์ด 'ทดสอบเชิญ2'	invitation	35	f	2025-07-07 12:18:30.285602+07	\N	ทดสอบเชิญ2	Kittinart Jankaew	\N
34	7	คุณได้รับคำเชิญเข้าร่วมบอร์ด	Kittinart Jankaew ได้เชิญคุณเข้าร่วมบอร์ด 'ทดสอบเชิญ2'	invitation	36	f	2025-07-07 12:32:07.54861+07	\N	ทดสอบเชิญ2	Kittinart Jankaew	\N
35	6	คุณได้รับคำเชิญเข้าร่วมบอร์ด	Kittinart Jankaew ได้เชิญคุณเข้าร่วมบอร์ด 'ทดสอบเชิญ2'	invitation	37	f	2025-07-07 12:32:15.757775+07	\N	ทดสอบเชิญ2	Kittinart Jankaew	\N
36	8	คุณได้รับคำเชิญเข้าร่วมบอร์ด	Kittinart Jankaew ได้เชิญคุณเข้าร่วมบอร์ด 'ทดสอบเชิญ2'	invitation	38	f	2025-07-07 12:32:17.647428+07	\N	ทดสอบเชิญ2	Kittinart Jankaew	\N
37	6	คุณถูกมอบหมายให้ดูแล Task	Task: การ์ด 1	task	30	f	2025-07-07 15:01:57.2095+07	\N	ทดสอบเชิญ2	Kittinart Jankaew	\N
38	6	คุณถูกมอบหมายให้ดูแล Task	Task: การ์ด 2	task	31	f	2025-07-07 15:09:33.371748+07	\N	ทดสอบเชิญ2	Kittinart Jankaew	\N
39	6	คุณถูกมอบหมายให้ดูแล Task	Task: การ์ด 3	task	32	f	2025-07-07 15:21:22.773258+07	\N	ทดสอบเชิญ2	Kittinart Jankaew	\N
40	6	คุณถูกมอบหมายให้ดูแล Task	Task: การ์ด 4	task	33	f	2025-07-07 15:28:40.575871+07	\N	ทดสอบเชิญ2	Kittinart Jankaew	\N
41	6	คุณถูกมอบหมายให้ดูแล Task	Task: การ์ด 5	task	34	f	2025-07-07 15:28:49.642584+07	\N	ทดสอบเชิญ2	Kittinart Jankaew	\N
42	6	คุณถูกมอบหมายให้ดูแล Task	Task: การ์ด 6	task	35	f	2025-07-07 15:30:49.970706+07	\N	ทดสอบเชิญ2	Kittinart Jankaew	\N
43	6	คุณถูกมอบหมายให้ดูแล Task	Task: การ์ด 7	task	36	f	2025-07-07 15:51:25.831371+07	\N	ทดสอบเชิญ2	Kittinart Jankaew	\N
44	6	คุณถูกมอบหมายให้ดูแล Task	Task: การ์ด 8	task	37	f	2025-07-07 16:00:36.638758+07	\N	ทดสอบเชิญ2	Kittinart Jankaew	\N
45	6	คุณถูกมอบหมายให้ดูแล Task	Task: การ์ด 9	task	38	f	2025-07-07 16:16:48.514195+07	\N	ทดสอบเชิญ2	Kittinart Jankaew	\N
46	6	คุณถูกมอบหมายให้ดูแล Task	Task: การ์ด 10	task	39	f	2025-07-07 16:17:25.817452+07	\N	ทดสอบเชิญ2	Kittinart Jankaew	\N
47	7	คุณได้รับมอบหมายงานใหม่	Task: เทส	task	40	f	2025-07-07 19:42:41.830137+07	\N	\N	\N	\N
48	6	คุณได้รับมอบหมายงานใหม่	Task: เทส	task	40	f	2025-07-07 19:43:29.08686+07	\N	\N	\N	\N
49	7	คุณได้รับมอบหมายงานใหม่	Task: แจ้งเตือน 1	task	41	f	2025-07-07 20:04:37.799865+07	\N	\N	\N	\N
50	6	คุณได้รับมอบหมายงานใหม่	Task: แจ้งเตือน 1	task	41	f	2025-07-07 20:08:23.652267+07	\N	\N	\N	\N
51	6	คุณได้รับมอบหมายงานใหม่	Task: แจ้งเตือน 2	task	42	f	2025-07-07 20:12:10.872289+07	\N	\N	\N	\N
52	6	คุณได้รับมอบหมายงานใหม่	Task: ทดลองเลี้ยงปลา	task	43	f	2025-07-07 20:29:27.645018+07	\N	\N	\N	\N
53	8	คุณได้รับคำเชิญเข้าร่วมบอร์ด	test1 test1 ได้เชิญคุณเข้าร่วมบอร์ด 'ทดสอบกดยืนยันแจ้งเตือน'	invitation	39	f	2025-07-07 20:32:50.313222+07	\N	ทดสอบกดยืนยันแจ้งเตือน	test1 test1	\N
54	7	คุณได้รับคำเชิญเข้าร่วมบอร์ด	test1 test1 ได้เชิญคุณเข้าร่วมบอร์ด 'ทดสอบกดยืนยันแจ้งเตือน'	invitation	40	f	2025-07-07 20:34:16.204188+07	\N	ทดสอบกดยืนยันแจ้งเตือน	test1 test1	\N
55	7	คุณได้รับมอบหมายงานใหม่	Task: ออกแบบ UI หน้า Dashboard	task	2	f	2025-07-07 20:43:37.663852+07	\N	\N	\N	\N
56	8	คุณได้รับมอบหมายงานใหม่	Task: ทดลองเลี้ยงปลา	task	43	f	2025-07-07 20:48:14.295272+07	\N	\N	\N	\N
\.


--
-- TOC entry 5019 (class 0 OID 16481)
-- Dependencies: 229
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tags (id, name) FROM stdin;
1	UI
2	UX
3	UU
\.


--
-- TOC entry 5026 (class 0 OID 16582)
-- Dependencies: 236
-- Data for Name: task_assignees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.task_assignees (id, task_id, user_id, assigned_at) FROM stdin;
2	31	6	2025-07-07 15:09:33.371748
3	32	6	2025-07-07 15:21:22.773258
4	33	6	2025-07-07 15:28:40.575871
5	34	6	2025-07-07 15:28:49.642584
6	35	6	2025-07-07 15:30:49.970706
7	36	6	2025-07-07 15:51:25.831371
8	37	6	2025-07-07 16:00:36.638758
9	38	6	2025-07-07 16:16:48.514195
11	40	7	2025-07-07 19:42:41.825371
12	40	6	2025-07-07 19:43:29.082725
13	41	7	2025-07-07 20:04:37.792426
14	41	6	2025-07-07 20:08:23.648301
15	42	6	2025-07-07 20:12:10.868139
16	43	6	2025-07-07 20:29:27.641764
17	2	7	2025-07-07 20:43:37.660652
18	43	8	2025-07-07 20:48:14.290103
\.


--
-- TOC entry 5020 (class 0 OID 16490)
-- Dependencies: 230
-- Data for Name: task_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.task_tags (task_id, tag_id) FROM stdin;
3	2
3	1
26	3
28	1
\.


--
-- TOC entry 5015 (class 0 OID 16445)
-- Dependencies: 225
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tasks (id, name, description, column_id, assignee_id, "position") FROM stdin;
2	ออกแบบ UI หน้า Dashboard	วาด wireframe เบื้องต้น	1	5	0
3	เขียน API Endpoint	สำหรับ column และ task	1	7	1
4	หห		2	\N	0
10	4444		2	\N	1
12	การกิน		2	\N	2
13	code init		8	\N	0
5	ห		\N	\N	0
6	พะะ		\N	\N	1
7	หห		\N	\N	2
9	แแแ		\N	\N	3
21	3		14	\N	1
11	พุธ		21	\N	0
29	topology	ส่งวันพรุ่งนี้	8	\N	2
28	cyber	รายละเอียด	18	\N	0
27	network		\N	\N	0
33	การ์ด 4		23	\N	3
34	การ์ด 5		23	\N	4
35	การ์ด 6		23	\N	5
36	การ์ด 7		23	\N	6
37	การ์ด 8		23	\N	7
38	การ์ด 9		23	\N	8
8	5858		11	\N	1
15	อิอิ		11	\N	1
14	ttlcopy		8	\N	0
31	การ์ด 2		24	\N	1
40	เทส		24	\N	1
32	การ์ด 3		24	\N	1
19	2		13	\N	0
41	แจ้งเตือน 1		25	\N	0
22	1		12	\N	0
25	1		12	\N	0
26	2		13	\N	0
24	3		14	\N	0
42	แจ้งเตือน 2		25	\N	1
44	น้องเวฟ		27	\N	0
43	ทดลองเลี้ยงปลา	5855555\n	28	\N	0
\.


--
-- TOC entry 5008 (class 0 OID 16390)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password_hash, first_name, last_name, created_at, updated_at) FROM stdin;
1	chatgptdev	dev@example.com	hashed_password_123	GPT	Bot	2025-07-05 11:28:02.957288	2025-07-05 11:28:02.957288
3	kanban_user	kanban@example.com	securepassword123	Kanban	User	2025-07-05 12:30:49.48721	2025-07-05 12:30:49.48721
4	another_user_001	another001@example.com	$2b$12$Hci/3g5P.4wXmdwB/5v4FuVPg/lugTGDsSeQUeqqqWcYZSeJImiyy	Another	Tester	2025-07-05 13:00:10.103203	2025-07-05 13:00:10.103203
5	testuser	test@example.com	$2b$12$.2ieV5vo0u6BknI7M3xHuuRBfXoL/DLSlbXQZj5fYP44Yh.GSyr7W	Test	User	2025-07-05 13:08:07.961507	2025-07-05 13:08:07.961507
6	user1	test101@gmail.com	$2b$12$7Cnjjn2PmPyZjUiuRGLgHuaErje/yMKMj459acrgs1LgqjTn3QD3K	test1	test1	2025-07-05 13:35:04.314876	2025-07-05 13:35:04.314876
7	test2	test112@gmail.com	$2b$12$zdKM657VhceV5nlQch0nSOTvh.IumwLpO2qkmvU1ALD0c10c00YTK	d	f	2025-07-05 15:01:45.152004	2025-07-05 15:01:45.152004
8	kittinart	kittinart_wave9283@hotmail.com	$2b$12$SCasIoBpHqb3a3PJcNua1uPQ7ELy6ZgFD1BGFvF8EKrU1JL1/XehS	Kittinart	Jankaew	2025-07-06 22:57:04.134136	2025-07-06 22:57:04.134136
\.


--
-- TOC entry 5041 (class 0 OID 0)
-- Dependencies: 231
-- Name: board_invitations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.board_invitations_id_seq', 40, true);


--
-- TOC entry 5042 (class 0 OID 0)
-- Dependencies: 219
-- Name: boards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.boards_id_seq', 14, true);


--
-- TOC entry 5043 (class 0 OID 0)
-- Dependencies: 222
-- Name: columns_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.columns_id_seq', 28, true);


--
-- TOC entry 5044 (class 0 OID 0)
-- Dependencies: 233
-- Name: invitations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.invitations_id_seq', 1, false);


--
-- TOC entry 5045 (class 0 OID 0)
-- Dependencies: 226
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 56, true);


--
-- TOC entry 5046 (class 0 OID 0)
-- Dependencies: 228
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tags_id_seq', 3, true);


--
-- TOC entry 5047 (class 0 OID 0)
-- Dependencies: 235
-- Name: task_assignees_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.task_assignees_id_seq', 18, true);


--
-- TOC entry 5048 (class 0 OID 0)
-- Dependencies: 224
-- Name: tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tasks_id_seq', 44, true);


--
-- TOC entry 5049 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 8, true);


--
-- TOC entry 4832 (class 2606 OID 16538)
-- Name: board_invitations board_invitations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.board_invitations
    ADD CONSTRAINT board_invitations_pkey PRIMARY KEY (id);


--
-- TOC entry 4815 (class 2606 OID 16411)
-- Name: boards boards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.boards
    ADD CONSTRAINT boards_pkey PRIMARY KEY (id);


--
-- TOC entry 4818 (class 2606 OID 16437)
-- Name: columns columns_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.columns
    ADD CONSTRAINT columns_pkey PRIMARY KEY (id);


--
-- TOC entry 4837 (class 2606 OID 16562)
-- Name: invitations invitations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invitations
    ADD CONSTRAINT invitations_pkey PRIMARY KEY (id);


--
-- TOC entry 4825 (class 2606 OID 16473)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 4828 (class 2606 OID 16488)
-- Name: tags tags_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_name_key UNIQUE (name);


--
-- TOC entry 4830 (class 2606 OID 16486)
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- TOC entry 4842 (class 2606 OID 16588)
-- Name: task_assignees task_assignees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_assignees
    ADD CONSTRAINT task_assignees_pkey PRIMARY KEY (id);


--
-- TOC entry 4844 (class 2606 OID 16590)
-- Name: task_assignees task_assignees_task_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_assignees
    ADD CONSTRAINT task_assignees_task_id_user_id_key UNIQUE (task_id, user_id);


--
-- TOC entry 4822 (class 2606 OID 16452)
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- TOC entry 4809 (class 2606 OID 16403)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4811 (class 2606 OID 16399)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4813 (class 2606 OID 16401)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4833 (class 1259 OID 16578)
-- Name: idx_invitations_board_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_invitations_board_id ON public.invitations USING btree (board_id);


--
-- TOC entry 4834 (class 1259 OID 16579)
-- Name: idx_invitations_invitee_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_invitations_invitee_id ON public.invitations USING btree (invitee_id);


--
-- TOC entry 4835 (class 1259 OID 16580)
-- Name: idx_invitations_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_invitations_status ON public.invitations USING btree (status);


--
-- TOC entry 4838 (class 1259 OID 16603)
-- Name: idx_task_assignees_assigned_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_task_assignees_assigned_at ON public.task_assignees USING btree (assigned_at);


--
-- TOC entry 4839 (class 1259 OID 16601)
-- Name: idx_task_assignees_task_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_task_assignees_task_id ON public.task_assignees USING btree (task_id);


--
-- TOC entry 4840 (class 1259 OID 16602)
-- Name: idx_task_assignees_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_task_assignees_user_id ON public.task_assignees USING btree (user_id);


--
-- TOC entry 4816 (class 1259 OID 16417)
-- Name: ix_boards_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_boards_id ON public.boards USING btree (id);


--
-- TOC entry 4819 (class 1259 OID 16443)
-- Name: ix_columns_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_columns_id ON public.columns USING btree (id);


--
-- TOC entry 4823 (class 1259 OID 16479)
-- Name: ix_notifications_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_notifications_id ON public.notifications USING btree (id);


--
-- TOC entry 4826 (class 1259 OID 16489)
-- Name: ix_tags_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_tags_id ON public.tags USING btree (id);


--
-- TOC entry 4820 (class 1259 OID 16463)
-- Name: ix_tasks_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_tasks_id ON public.tasks USING btree (id);


--
-- TOC entry 4854 (class 2606 OID 16539)
-- Name: board_invitations board_invitations_board_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.board_invitations
    ADD CONSTRAINT board_invitations_board_id_fkey FOREIGN KEY (board_id) REFERENCES public.boards(id) ON DELETE CASCADE;


--
-- TOC entry 4855 (class 2606 OID 16549)
-- Name: board_invitations board_invitations_invited_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.board_invitations
    ADD CONSTRAINT board_invitations_invited_by_user_id_fkey FOREIGN KEY (invited_by_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4856 (class 2606 OID 16544)
-- Name: board_invitations board_invitations_invited_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.board_invitations
    ADD CONSTRAINT board_invitations_invited_user_id_fkey FOREIGN KEY (invited_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4846 (class 2606 OID 16421)
-- Name: board_members board_members_board_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.board_members
    ADD CONSTRAINT board_members_board_id_fkey FOREIGN KEY (board_id) REFERENCES public.boards(id);


--
-- TOC entry 4847 (class 2606 OID 16426)
-- Name: board_members board_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.board_members
    ADD CONSTRAINT board_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4845 (class 2606 OID 16412)
-- Name: boards boards_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.boards
    ADD CONSTRAINT boards_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
-- TOC entry 4848 (class 2606 OID 16438)
-- Name: columns columns_board_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.columns
    ADD CONSTRAINT columns_board_id_fkey FOREIGN KEY (board_id) REFERENCES public.boards(id) ON DELETE CASCADE;


--
-- TOC entry 4857 (class 2606 OID 16563)
-- Name: invitations invitations_board_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invitations
    ADD CONSTRAINT invitations_board_id_fkey FOREIGN KEY (board_id) REFERENCES public.boards(id) ON DELETE CASCADE;


--
-- TOC entry 4858 (class 2606 OID 16573)
-- Name: invitations invitations_invitee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invitations
    ADD CONSTRAINT invitations_invitee_id_fkey FOREIGN KEY (invitee_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4859 (class 2606 OID 16568)
-- Name: invitations invitations_inviter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invitations
    ADD CONSTRAINT invitations_inviter_id_fkey FOREIGN KEY (inviter_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4851 (class 2606 OID 16474)
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4860 (class 2606 OID 16591)
-- Name: task_assignees task_assignees_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_assignees
    ADD CONSTRAINT task_assignees_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE;


--
-- TOC entry 4861 (class 2606 OID 16596)
-- Name: task_assignees task_assignees_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_assignees
    ADD CONSTRAINT task_assignees_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4852 (class 2606 OID 16498)
-- Name: task_tags task_tags_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_tags
    ADD CONSTRAINT task_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;


--
-- TOC entry 4853 (class 2606 OID 16493)
-- Name: task_tags task_tags_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_tags
    ADD CONSTRAINT task_tags_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE;


--
-- TOC entry 4849 (class 2606 OID 16458)
-- Name: tasks tasks_assignee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_assignee_id_fkey FOREIGN KEY (assignee_id) REFERENCES public.users(id);


--
-- TOC entry 4850 (class 2606 OID 16453)
-- Name: tasks tasks_column_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_column_id_fkey FOREIGN KEY (column_id) REFERENCES public.columns(id) ON DELETE CASCADE;


-- Completed on 2025-07-07 21:21:10

--
-- PostgreSQL database dump complete
--

