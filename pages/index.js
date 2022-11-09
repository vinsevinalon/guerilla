import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { GraphQLClient, gql } from 'graphql-request';
import HeroComponent from './hero';
import AboutComponent from './about';
import FooterComponent from './footer';

export async function getStaticProps() {
    const endpoint = process.env.PREVIEW_ENDPOINT;
    const graphQLClient = new GraphQLClient(endpoint);
    graphQLClient.setHeader(
        'Authorization',
        `Bearer ${process.env.PREVIEW_TOKEN}`
    );

    const query = gql`
        {
            propertyCollection(limit: 6) {
                items {
                    id
                    title
                    address
                    category
                    image {
                        url
                    }
                }
            }
        }
    `;

    const data = await graphQLClient.request(query);
    return {
        props: { data }, // will be passed to the page component as props
    };
}

export default function Home(data) {
    return (
        <div className={styles.container}>
            <Head>
                <title>Lugar</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <HeroComponent />
                <div className={styles.grid}>
                    {data.data.propertyCollection.items.map((item) => (
                        <a key={item.id} href="#" className={styles.card}>
                            <Image
                                src={item.image.url}
                                alt={item.title}
                                width={300}
                                height={200}
                                priority
                            />
                            <h3>{item.title}</h3>
                            <p>{item.address}</p>
                        </a>
                    ))}
                </div>
            </main>
            <AboutComponent />
            <FooterComponent />
        </div>
    );
}
