import { GraphAlgorithm, Step } from "../../GraphAlgorithm";
import { Edge, EdgeList, Graph, Node } from "../../GraphStructure";
import { Queue } from "../../utils/DataStructure";
import { NetworkFlowBase, min, max, _Edge } from "./Common";

class EdmondsKarp extends GraphAlgorithm {
  constructor() {
    super("EdmondsKarp", "Edmonds-Karp algorithm for Maximum Network Flow");
  }

  private que: Queue<number> = new Queue<number>();

  private E: NetworkFlowBase;
  private V: Node[] = [];
  private n: number = 0;
  private S: number;
  private T: number;

  private pre: number[] = [];
  private eid: number[] = [];
  private flw: number[] = [];

  clear(buf: any[], val: any = -1, cnt: number = this.n) {
    for (let _ = 0; _ < cnt; ++_) buf[_] = val;
  }

  mark() {
    for (let pos = this.T; pos !== this.S; pos = this.pre[pos]) this.E.edge[this.eid[pos]].mark = true;
  }

  flip(): number {
    let res = this.flw[this.T];
    for (let pos = this.T; pos !== this.S; pos = this.pre[pos]) {
      this.E.edge[this.eid[pos]].flow -= res;
      this.E.edge[this.eid[pos] ^ 1].flow += res;
    }
    return res;
  }

  bfs(): boolean {
    this.que.clear();
    this.clear(this.eid), this.clear(this.pre), this.clear(this.flw, Infinity);

    this.que.push(this.S);
    while (!this.que.empty()) {
      let pos = this.que.front();
      this.que.pop();
      if (pos === this.T) {
        this.mark();
        return true;
      }
      let e: _Edge;
      for (let i = this.E.head[pos]; i !== -1; i = e.next) {
        e = this.E.edge[i];
        if (this.pre[e.to] === -1 && e.flow > 0) {
          this.que.push(e.to);
          this.pre[e.to] = pos;
          this.eid[e.to] = i;
          this.flw[e.to] = min(this.flw[pos], e.flow);
        }
      }
    }

    return false;
  }

  *run(G: Graph, Spos: number, Tpos: number): Generator<Step> {
    this.V = G.nodes();
    this.n = this.V.length;
    this.E = new NetworkFlowBase(G, this.n);
    (this.S = Spos), (this.T = Tpos);

    let flow = 0,
      delta = 0;
    while (this.bfs()) {
      // Yield before augment flow
      yield { graph: new EdgeList(this.n, this.E.edges()) };

      delta = this.flip();
      flow += delta;

      // Yield after augment flow
      yield { graph: new EdgeList(this.n, this.E.edges()) };
    }

    console.log(`algo EdmondsKarp : {flow: ${flow}}`);
    return { flow };
  }
}

export { EdmondsKarp };

/*
Reference:

int n,m,s,t;
int h[205],fr[10005],to[10005],w[10005],cnt=1;
void add(int u,int v,int val)
{
	fr[++cnt]=h[u];
	h[u]=cnt;
	to[cnt]=v;
	w[cnt]=val;
}
int lst[205],edg[205],f[205];//分别表示每个点由哪个点、哪条边得到标号，以及流量
bool bfs()
{
	queue<int>q;
	memset(lst,0,sizeof(lst));
	f[s]=inf;
	q.push(s);
	while(!q.empty())//寻找最短增流路径
	{
		int x=q.front();q.pop();
		if(x==t)return 1;//可以找到到达t的增流路径，且为最短
		for(int i=h[x];i;i=fr[i])
		{
			if(w[i]&&(!lst[to[i]]))
			{
				q.push(to[i]);
				lst[to[i]]=x;
				edg[to[i]]=i;
				f[to[i]]=min(f[x],w[i]);
			}
		}
	}
	return 0;
}
int flow()
{
	int x=t;
	while(x!=s)
	{
		int e=edg[x];
		w[e]-=f[t];
		w[e^1]+=f[t];
		x=lst[x];//增流过程，由之前所说直接修改流量
	}
	return f[t];
}
int EK()
{
	int ans=0;
	while(bfs())
	{
		ans+=flow();
	}
	return ans;
}
 */