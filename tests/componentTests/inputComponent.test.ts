import {afterEach, expect, test, describe} from "vitest";
import _inputComponent from "~/components/InputComponent.vue";
import {mount} from "@vue/test-utils";
import {useCandidateStore} from "~/store/CandidateStore";

let c_name = "Tobias Frischmann";
let c_class = "4AHIF";

const candidateStore = useCandidateStore();

describe("inputComponentTest", () => {
    afterEach(() => {
        candidateStore.$reset();
    })


    test("add_candidate", () => {
        expect(_inputComponent).toBeTruthy();

        const wrapper = mount(_inputComponent, {
            props: {voteStarted: false}
        });

        wrapper.vm.addCandidate({name: c_name, class: c_class});

        expect(candidateStore.candidates[0].name).toBe(c_name);
        expect(candidateStore.candidates[0].class).toBe(c_class);

    });

    test("doesn't_add_when_voteStarted", async () => {
        expect(_inputComponent).toBeTruthy();

        const wrapper = mount(_inputComponent, {
            props: {voteStarted: true}
        })

        await wrapper.find("#addButton").trigger("click");

        expect(candidateStore.candidates.length).toBe(0);
    })

})