import "cheerio";
import 'dotenv/config';
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { pull } from "langchain/hub";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { InMemoryCache } from "@langchain/core/caches";

async function main() {
  const loader = new CheerioWebBaseLoader(
    "https://lilianweng.github.io/posts/2023-06-23-agent/"
  );

  const cache = new InMemoryCache();

  const docs = await loader.load();

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const splits = await textSplitter.splitDocuments(docs);

  const vectorStore = await MemoryVectorStore.fromDocuments(
    splits,
    new OpenAIEmbeddings()
  );

  // Retrieve and generate using the relevant snippets of the blog.
  const retriever = vectorStore.asRetriever();

  const prompt = await pull<ChatPromptTemplate>("rlm/rag-prompt");

  const llm = new ChatOpenAI({
    model: "gpt-3.5-turbo",
    temperature: 0,
    maxRetries: 5,
    cache,
  });

  const ragChain = await createStuffDocumentsChain({
    llm,
    prompt,
    outputParser: new StringOutputParser(),
  });

  const retrievedDocs = await retriever.invoke("what is task decomposition");

  const res = await ragChain.invoke({
    question: "What is task decomposition?",
    context: retrievedDocs,
  });

  console.log(res)
}

main()